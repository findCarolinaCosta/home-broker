import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ExtensionPrismaService } from '../prisma/extension-prisma/extension-prisma.service';

@Injectable()
export class WalletsService extends ExtensionPrismaService {
  create(data: CreateWalletDto) {
    return this.prismaService.wallet.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.wallet.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
