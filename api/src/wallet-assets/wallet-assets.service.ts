import { Injectable } from '@nestjs/common';
import { CreateWalletAssetDto } from './dto/create-wallet-asset.dto';
import { UpdateWalletAssetDto } from './dto/update-wallet-asset.dto';
import { FilterWalletAssetDto } from './dto/filter-wallet-asset.dto';
import { ExtensionPrismaService } from 'src/prisma/extension-prisma/extension-prisma.service';

@Injectable()
export class WalletAssetsService extends ExtensionPrismaService {
  create(data: CreateWalletAssetDto) {
    return this.prismaService.walletAsset.create({
      data: {
        ...data,
        version: 1,
      },
    });
  }

  findAll(filters: FilterWalletAssetDto) {
    return this.prismaService.walletAsset.findMany({
      where: filters,
      include: {
        Asset: {
          select: {
            id: true,
            symbol: true,
            price: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} walletAsset`;
  }

  update(id: number, updateWalletAssetDto: UpdateWalletAssetDto) {
    return `This action updates a #${id} walletAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletAsset`;
  }
}
