use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer as SystemTransfer};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, CloseAccount, Mint, Token, TokenAccount, TransferChecked};

declare_id!("11111111111111111111111111111111");

const DEFAULT_FEE_BPS: u16 = 50;
const MAX_FEE_BPS: u16 = 10_000;

#[program]
pub mod yakk_otc_desk {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        fee_bps: Option<u16>,
        paused: bool,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        let fee = fee_bps.unwrap_or(DEFAULT_FEE_BPS);
        require!(fee <= MAX_FEE_BPS, OtcError::InvalidFeeBps);

        config.authority = ctx.accounts.authority.key();
        config.fee_collector = ctx.accounts.fee_collector.key();
        config.fee_bps = fee;
        config.paused = paused;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    pub fn create_listing(
        ctx: Context<CreateListing>,
        listing_id: u64,
        offered_mint: Pubkey,
        payment_mint: Pubkey,
        offered_amount: u64,
        payment_amount: u64,
    ) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, OtcError::ProgramPaused);
        require!(offered_amount > 0 && payment_amount > 0, OtcError::InvalidAmount);

        let listing = &mut ctx.accounts.listing;
        listing.seller = ctx.accounts.seller.key();
        listing.listing_id = listing_id;
        listing.offered_mint = offered_mint;
        listing.payment_mint = payment_mint;
        listing.offered_amount = offered_amount;
        listing.payment_amount = payment_amount;
        listing.bump = ctx.bumps.listing;
        listing.vault_bump = ctx.bumps.vault_authority;
        listing.is_active = true;

        if offered_mint == spl_token::native_mint::ID {
            require!(ctx.accounts.offered_mint.key() == spl_token::native_mint::ID, OtcError::InvalidMint);
            require!(ctx.accounts.payment_mint_account.key() != spl_token::native_mint::ID, OtcError::InvalidMint);

            let cpi_accounts = SystemTransfer {
                from: ctx.accounts.seller.to_account_info(),
                to: ctx.accounts.vault_authority.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, offered_amount)?;
        } else {
            require!(ctx.accounts.offered_mint.key() == offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.payment_mint_account.key() == payment_mint, OtcError::InvalidMint);
            require!(ctx.accounts.seller_source.mint == offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.vault_token.mint == offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.seller_source.owner == ctx.accounts.seller.key(), OtcError::InvalidOwner);

            let decimals = ctx.accounts.offered_mint.decimals;
            let cpi_accounts = TransferChecked {
                from: ctx.accounts.seller_source.to_account_info(),
                mint: ctx.accounts.offered_mint.to_account_info(),
                to: ctx.accounts.vault_token.to_account_info(),
                authority: ctx.accounts.seller.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
            token::transfer_checked(cpi_ctx, offered_amount, decimals)?;
        }

        Ok(())
    }

    pub fn fill_listing(
        ctx: Context<FillListing>,
        expected_payment_amount: u64,
        expected_offered_amount: u64,
    ) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, OtcError::ProgramPaused);

        let listing = &mut ctx.accounts.listing;
        require!(listing.is_active, OtcError::ListingNotActive);
        require!(listing.payment_amount == expected_payment_amount, OtcError::PriceMismatch);
        require!(listing.offered_amount == expected_offered_amount, OtcError::PriceMismatch);

        let fee = ((listing.payment_amount as u128)
            .checked_mul(config.fee_bps as u128)
            .ok_or(OtcError::MathOverflow)?)
            .checked_div(10_000)
            .ok_or(OtcError::MathOverflow)? as u64;
        let seller_proceeds = listing
            .payment_amount
            .checked_sub(fee)
            .ok_or(OtcError::MathOverflow)?;

        if listing.payment_mint == spl_token::native_mint::ID {
            require!(ctx.accounts.payment_mint.key() == spl_token::native_mint::ID, OtcError::InvalidMint);
            require!(ctx.accounts.offered_mint.key() != spl_token::native_mint::ID, OtcError::InvalidMint);

            let fee_transfer = SystemTransfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.fee_collector.to_account_info(),
            };
            system_program::transfer(
                CpiContext::new(ctx.accounts.system_program.to_account_info(), fee_transfer),
                fee,
            )?;

            let seller_transfer = SystemTransfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            };
            system_program::transfer(
                CpiContext::new(ctx.accounts.system_program.to_account_info(), seller_transfer),
                seller_proceeds,
            )?;
        } else {
            require!(ctx.accounts.payment_mint.key() == listing.payment_mint, OtcError::InvalidMint);
            require!(ctx.accounts.buyer_payment_ata.mint == listing.payment_mint, OtcError::InvalidMint);
            require!(ctx.accounts.seller_receive_ata.mint == listing.payment_mint, OtcError::InvalidMint);
            require!(ctx.accounts.fee_collector_ata.mint == listing.payment_mint, OtcError::InvalidMint);
            require!(ctx.accounts.buyer_payment_ata.owner == ctx.accounts.buyer.key(), OtcError::InvalidOwner);
            require!(ctx.accounts.seller_receive_ata.owner == ctx.accounts.seller.key(), OtcError::InvalidOwner);

            let decimals = ctx.accounts.payment_mint.decimals;

            let fee_cpi = TransferChecked {
                from: ctx.accounts.buyer_payment_ata.to_account_info(),
                mint: ctx.accounts.payment_mint.to_account_info(),
                to: ctx.accounts.fee_collector_ata.to_account_info(),
                authority: ctx.accounts.buyer.to_account_info(),
            };
            token::transfer_checked(
                CpiContext::new(ctx.accounts.token_program.to_account_info(), fee_cpi),
                fee,
                decimals,
            )?;

            let seller_cpi = TransferChecked {
                from: ctx.accounts.buyer_payment_ata.to_account_info(),
                mint: ctx.accounts.payment_mint.to_account_info(),
                to: ctx.accounts.seller_receive_ata.to_account_info(),
                authority: ctx.accounts.buyer.to_account_info(),
            };
            token::transfer_checked(
                CpiContext::new(ctx.accounts.token_program.to_account_info(), seller_cpi),
                seller_proceeds,
                decimals,
            )?;
        }

        let listing_id_bytes = listing.listing_id.to_le_bytes();
        let signer_seeds: &[&[u8]] = &[
            b"otc",
            listing.seller.as_ref(),
            listing_id_bytes.as_ref(),
            &[listing.vault_bump],
        ];
        let signer = &[signer_seeds];

        if listing.offered_mint == spl_token::native_mint::ID {
            require!(ctx.accounts.offered_mint.key() == spl_token::native_mint::ID, OtcError::InvalidMint);

            let vault_lamports = ctx.accounts.vault_authority.to_account_info().lamports();
            require!(vault_lamports >= listing.offered_amount, OtcError::InsufficientEscrowBalance);

            **ctx.accounts.vault_authority.to_account_info().try_borrow_mut_lamports()? -= listing.offered_amount;
            **ctx.accounts.buyer.to_account_info().try_borrow_mut_lamports()? += listing.offered_amount;
        } else {
            require!(ctx.accounts.offered_mint.key() == listing.offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.vault_token.mint == listing.offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.buyer_receive_ata.mint == listing.offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.buyer_receive_ata.owner == ctx.accounts.buyer.key(), OtcError::InvalidOwner);

            let decimals = ctx.accounts.offered_mint.decimals;
            let cpi_accounts = TransferChecked {
                from: ctx.accounts.vault_token.to_account_info(),
                mint: ctx.accounts.offered_mint.to_account_info(),
                to: ctx.accounts.buyer_receive_ata.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer,
            );
            token::transfer_checked(cpi_ctx, listing.offered_amount, decimals)?;

            let close_cpi = CloseAccount {
                account: ctx.accounts.vault_token.to_account_info(),
                destination: ctx.accounts.seller.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            };
            token::close_account(CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                close_cpi,
                signer,
            ))?;
        }

        listing.is_active = false;
        Ok(())
    }

    pub fn cancel_listing(ctx: Context<CancelListing>) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, OtcError::ProgramPaused);

        let listing = &mut ctx.accounts.listing;
        require!(listing.is_active, OtcError::ListingNotActive);

        let listing_id_bytes = listing.listing_id.to_le_bytes();
        let signer_seeds: &[&[u8]] = &[
            b"otc",
            listing.seller.as_ref(),
            listing_id_bytes.as_ref(),
            &[listing.vault_bump],
        ];
        let signer = &[signer_seeds];

        if listing.offered_mint == spl_token::native_mint::ID {
            require!(ctx.accounts.offered_mint.key() == spl_token::native_mint::ID, OtcError::InvalidMint);

            let vault_lamports = ctx.accounts.vault_authority.to_account_info().lamports();
            require!(vault_lamports >= listing.offered_amount, OtcError::InsufficientEscrowBalance);

            **ctx.accounts.vault_authority.to_account_info().try_borrow_mut_lamports()? -= listing.offered_amount;
            **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += listing.offered_amount;
        } else {
            require!(ctx.accounts.offered_mint.key() == listing.offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.vault_token.mint == listing.offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.seller_destination.mint == listing.offered_mint, OtcError::InvalidMint);
            require!(ctx.accounts.seller_destination.owner == ctx.accounts.seller.key(), OtcError::InvalidOwner);

            let decimals = ctx.accounts.offered_mint.decimals;
            let cpi_accounts = TransferChecked {
                from: ctx.accounts.vault_token.to_account_info(),
                mint: ctx.accounts.offered_mint.to_account_info(),
                to: ctx.accounts.seller_destination.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer,
            );
            token::transfer_checked(cpi_ctx, listing.offered_amount, decimals)?;

            let close_cpi = CloseAccount {
                account: ctx.accounts.vault_token.to_account_info(),
                destination: ctx.accounts.seller.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            };
            token::close_account(CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                close_cpi,
                signer,
            ))?;
        }

        listing.is_active = false;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: fee collector can be any system account or multisig-controlled address.
    pub fee_collector: UncheckedAccount<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(listing_id: u64, offered_mint: Pubkey, payment_mint: Pubkey, offered_amount: u64, payment_amount: u64)]
pub struct CreateListing<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        init,
        payer = seller,
        space = 8 + Listing::INIT_SPACE,
        seeds = [b"otc", seller.key().as_ref(), &listing_id.to_le_bytes()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    /// CHECK: PDA used as SOL escrow authority and token vault authority.
    #[account(
        mut,
        seeds = [b"otc", seller.key().as_ref(), &listing_id.to_le_bytes()],
        bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,
    pub offered_mint: Account<'info, Mint>,
    pub payment_mint_account: Account<'info, Mint>,
    #[account(
        mut,
        constraint = seller_source.owner == seller.key() @ OtcError::InvalidOwner,
        constraint = seller_source.mint == offered_mint.key() @ OtcError::InvalidMint,
    )]
    pub seller_source: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = seller,
        associated_token::mint = offered_mint,
        associated_token::authority = vault_authority,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FillListing<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut, address = listing.seller)]
    /// CHECK: seller receives SOL proceeds or ATA proceeds.
    pub seller: UncheckedAccount<'info>,
    #[account(
        seeds = [b"config"],
        bump = config.bump,
        constraint = fee_collector.key() == config.fee_collector @ OtcError::InvalidFeeCollector,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"otc", listing.seller.as_ref(), &listing.listing_id.to_le_bytes()],
        bump = listing.bump,
        constraint = listing.is_active @ OtcError::ListingNotActive,
    )]
    pub listing: Account<'info, Listing>,
    /// CHECK: PDA signer/escrow authority.
    #[account(
        mut,
        seeds = [b"otc", listing.seller.as_ref(), &listing.listing_id.to_le_bytes()],
        bump = listing.vault_bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,
    /// CHECK: Verified against config.fee_collector.
    #[account(mut)]
    pub fee_collector: UncheckedAccount<'info>,
    pub offered_mint: Account<'info, Mint>,
    pub payment_mint: Account<'info, Mint>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_receive_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_payment_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_receive_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub fee_collector_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelListing<'info> {
    #[account(mut, address = listing.seller)]
    pub seller: Signer<'info>,
    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"otc", seller.key().as_ref(), &listing.listing_id.to_le_bytes()],
        bump = listing.bump,
        constraint = listing.is_active @ OtcError::ListingNotActive,
    )]
    pub listing: Account<'info, Listing>,
    /// CHECK: PDA signer/escrow authority.
    #[account(
        mut,
        seeds = [b"otc", seller.key().as_ref(), &listing.listing_id.to_le_bytes()],
        bump = listing.vault_bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,
    pub offered_mint: Account<'info, Mint>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_destination: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    pub fee_collector: Pubkey,
    pub fee_bps: u16,
    pub paused: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Listing {
    pub seller: Pubkey,
    pub listing_id: u64,
    pub offered_mint: Pubkey,
    pub payment_mint: Pubkey,
    pub offered_amount: u64,
    pub payment_amount: u64,
    pub bump: u8,
    pub vault_bump: u8,
    pub is_active: bool,
}

#[error_code]
pub enum OtcError {
    #[msg("Listing is not active")]
    ListingNotActive,
    #[msg("Provided price or amount does not match the listing")]
    PriceMismatch,
    #[msg("Program is globally paused")]
    ProgramPaused,
    #[msg("Invalid mint provided for this listing")]
    InvalidMint,
    #[msg("Invalid owner for token account")]
    InvalidOwner,
    #[msg("Fee basis points are invalid")]
    InvalidFeeBps,
    #[msg("Invalid fee collector account")]
    InvalidFeeCollector,
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Arithmetic overflow")]
    MathOverflow,
    #[msg("Escrow balance is insufficient")]
    InsufficientEscrowBalance,
}
