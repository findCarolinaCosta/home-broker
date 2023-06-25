import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ExtensionPrismaService } from './extension-prisma/extension-prisma.service';

@Global()
@Module({
  providers: [PrismaService, ExtensionPrismaService],
  exports: [PrismaService, ExtensionPrismaService],
})
export class PrismaModule {}
