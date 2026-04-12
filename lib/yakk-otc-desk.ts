// @ts-nocheck
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID");
const YST_MINT = new PublicKey("jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV");
const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

export async function createListingExample(program: Program<any>, sellerSourceAta: PublicKey) {
  const seller = program.provider.publicKey!;
  const listingId = new BN(Date.now());
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("otc"), seller.toBuffer(), listingId.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );

  const vaultAta = getAssociatedTokenAddressSync(YST_MINT, listingPda, true);
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);

  return program.methods
    .createListing(
      listingId,
      YST_MINT,
      SOL_MINT,
      new BN(1_000_000_000),
      new BN(2_000_000_000)
    )
    .accounts({
      seller,
      config: configPda,
      listing: listingPda,
      vaultAuthority: listingPda,
      offeredMint: YST_MINT,
      paymentMintAccount: SOL_MINT,
      sellerSource: sellerSourceAta,
      vaultToken: vaultAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
}

export async function fillListingExample(
  program: Program<any>,
  seller: PublicKey,
  listingId: BN,
  buyerYstAta: PublicKey,
  buyerPaymentAta?: PublicKey,
  sellerReceiveAta?: PublicKey,
  feeCollectorAta?: PublicKey
) {
  const buyer = program.provider.publicKey!;
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("otc"), seller.toBuffer(), listingId.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);

  const vaultAta = getAssociatedTokenAddressSync(YST_MINT, listingPda, true);
  const feeCollector = new PublicKey("YOUR_FEE_COLLECTOR");

  return program.methods
    .fillListing(new BN(2_000_000_000), new BN(1_000_000_000))
    .accounts({
      buyer,
      seller,
      config: configPda,
      listing: listingPda,
      vaultAuthority: listingPda,
      feeCollector,
      offeredMint: YST_MINT,
      paymentMint: SOL_MINT,
      vaultToken: vaultAta,
      buyerReceiveAta: buyerYstAta,
      buyerPaymentAta: buyerPaymentAta ?? buyerYstAta,
      sellerReceiveAta: sellerReceiveAta ?? buyerYstAta,
      feeCollectorAta: feeCollectorAta ?? buyerYstAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}
