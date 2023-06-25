import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionPrismaService } from './extension-prisma.service';

describe('ExtensionPrismaService', () => {
  let service: ExtensionPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtensionPrismaService],
    }).compile();

    service = module.get<ExtensionPrismaService>(ExtensionPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
