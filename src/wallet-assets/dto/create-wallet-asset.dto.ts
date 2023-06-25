export class BodyWalletAssetDto {
  asset_id: string;
  shares: number;
}

export class CreateWalletAssetDto extends BodyWalletAssetDto {
  wallet_id: string;
}
