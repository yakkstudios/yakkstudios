// YST token holder snapshot — updated 2026-04-11
// Used for instant gate checks before live RPC calls.
// Source: export_token_holders_jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV_1775922060502.csv
// All balances are uiAmount (decimals already applied) and rounded to whole tokens.

export const MASTER_WALLET =
    '7P7xYDAyeV13vumm' + '8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB';

/** Snapshot balances keyed by wallet address */
export const HOLDER_SNAPSHOT: Record<string, number> = {
    // ── Tier: LP / Whale Club (10M+) ──────────────────────
    ['Fh' + 'Vo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM']: 696_009_580, // Meteora LP pair
    ['6z' + 'Nu2CANyDcEnShj8jxadEYw6JEVYbirJH817my2Ae9q']: 150_053_867,
    ['Ev' + 'jgKfFjfdm3MUtfioqhyv1SzdbiCXrxcwovFh9UYzq6']:  64_602_063, // reporting holder 2026-04-11
    ['5J' + 'LXMoiz9AnVP5ocGfioGuoP4Nq5s6rvm58Lk44xDsSX']:  24_890_118,
    ['6x' + 'syyc5euLKxQQPWRGQfX8uh3eZJYH68zoKSwWv1acnY']:  19_719_408,
    ['8E' + 'wCr3zd4PqynWgNT8v3JZGPV9us93kscNmHT9ivcBU7']:  19_600_000,
    ['H5' + 'brRaQ2pEbZgfnRxEVEydBukyxJD29jEutmAHeXVPqB']:  10_000_000,
    // ── Tier: Core (250k+) ────────────────────────────────
    ['EL' + 'fu11G3VVsXHVfYsuvedZ9af8vBfF5vEJWBwJBP748f']:   5_477_444,
    ['Bh' + 'sYTPtvVeTYPNxGKhVxHDaCTjjRmzqmWBXrPTk7MijN']:   2_113_925,
    ['8A' + 'iytGY4Jquyr9HZ1uS7axC2y1vkNqNEChqirX8RZQLc']:   2_031_907,
    ['7C' + 'sMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n']:   1_154_280,
    ['Cw' + 'eq5MLi2ELoTXfrVauyKCe4PmTMDrGVtQw1KgQ7imkQ']:     533_330,
    ['7o' + 'KJVspmgeEZ7bDrBBxTJ2FLvRcJef7baNWCuWN4MMSk']:     397_572,
    ['2c' + 'VFJA1Eyv9Wo5SVrvKpSxTCJWjDBwGsa9e9UyKY9viM']:     250_000,
    // ── Tier: Staked / sub-gate (not whitelisted but kept for display) ────
    ['8p' + 'sNvWTrdNTiVRNzAgsou9kETXNJm2SXZyaKuJraVRtf']:     119_625,
    ['BE' + 'ochrdGhm5pcKVF73DURYrGo1DLzxq6bBcUBphQR64d']:       3_973,
    // Note: wallet 6VCNbc… dropped from 10.1M → ~0 between 2026-03-28 and 2026-04-11 (moved/exited).
    // Note: wallet 7P7xYD… (previous master placeholder) and 4r3bwC… no longer appear in the CSV.
};

export function getSnapshotBalance(wallet: string): number {
    return HOLDER_SNAPSHOT[wallet] ?? 0;
}

export function isApprovedHolder(wallet: string): boolean {
    return getSnapshotBalance(wallet) >= 250_000;
}
