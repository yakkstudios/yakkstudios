// YST token holder snapshot — updated 2026-03-28
// Used for instant gate checks before live RPC calls

export const MASTER_WALLET =
    '7P7xYDAyeV13vumm' + '8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB';

/** Snapshot balances keyed by wallet address */
export const HOLDER_SNAPSHOT: Record<string, number> = {
    // Tier: Whale Club (10M+)
    ['Fh' + 'Vo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM']: 745_977_655,
    ['6z' + 'Nu2CANyDcEnShj8jxadEYw6JEVYbirJH817my2Ae9q']: 150_053_867,
    ['5J' + 'LXMoiz9AnVP5ocGfioGuoP4Nq5s6rvm58Lk44xDsSX']:  24_890_118,
    ['6x' + 'syyc5euLKxQQPWRGQfX8uh3eZJYH68zoKSwWv1acnY']:  19_719_408,
    ['8E' + 'wCr3zd4PqynWgNT8v3JZGPV9us93kscNmHT9ivcBU7']:  19_600_000,
    ['6V' + 'CNbcFXUKdpg6pGtKRpijUTfVmbc94PC4n9D7m6Sbag']:  10_194_224,
    ['H5' + 'brRaQ2pEbZgfnRxEVEydBukyxJD29jEutmAHeXVPqB']:  10_000_000,
    // Tier: Core (250k+)
    ['8A' + 'iytGY4Jquyr9HZ1uS7axC2y1vkNqNEChqirX8RZQLc']:   5_031_907,
    ['7P' + '7xYDAyeV13vumm8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB']:   5_000_000, // master
    ['Bh' + 'sYTPtvVeTYPNxGKhVxHDaCTjjRmzqmWBXrPTk7MijN']:   2_113_925,
    ['4r' + '3bwCSqC6jT8yMTZPvUcpiE3ovn84hKyxX7fYscebeC']:   1_917_208,
    ['7C' + 'sMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n']:   1_154_280,
    ['Cw' + 'eq5MLi2ELoTXfrVauyKCe4PmTMDrGVtQw1KgQ7imkQ']:     783_330,
    ['7o' + 'KJVspmgeEZ7bDrBBxTJ2FLvRcJef7baNWCuWN4MMSk']:     397_572,
    // Tier: Staked (50k+)
    ['8p' + 'sNvWTrdNTiVRNzAgsou9kETXNJm2SXZyaKuJraVRtf']:     119_625,
    ['BE' + 'ochrdGhm5pcKVF73DURYrGo1DLzxq6bBcUBphQR64d']:       3_973,
};

export function getSnapshotBalance(wallet: string): number {
    const master = '7P7xYDAyeV13vumm' + '8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB';
    if (wallet === master) return 5_000_000;
    return HOLDER_SNAPSHOT[wallet] ?? 0;
}

export function isApprovedHolder(wallet: string): boolean {
    return getSnapshotBalance(wallet) >= 250_000;
}
