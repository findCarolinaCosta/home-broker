import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExtensionPrismaService {
  constructor(protected prismaService: PrismaService = new PrismaService()) {
    this.prismaService = prismaService;
  }
}
