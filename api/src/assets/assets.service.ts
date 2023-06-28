import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ExtensionPrismaService } from '../prisma/extension-prisma/extension-prisma.service';

@Injectable()
export class AssetsService extends ExtensionPrismaService {
  create(data: CreateAssetDto) {
    return this.prismaService.asset.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.asset.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} asset`;
  }

  update(id: number, updateAssetDto: UpdateAssetDto) {
    return `This action updates a #${id} asset`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }
}
