import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ExtensionPrismaService } from '../prisma/extension-prisma/extension-prisma.service';
import { InitTransactionDto } from './dto/init-transaction.dto';
import { OrderStatus, OrderType } from '@prisma/client';
import { InputTransactionDto } from './dto/input-transaction.dto';

@Injectable()
export class OrdersService extends ExtensionPrismaService {
  initTransaction(data: InitTransactionDto) {
    return this.prismaService.order.create({
      data: {
        ...data,
        partial: data.shares,
        status: OrderStatus.PENDING,
        version: 1,
      },
    });
  }

  async executeTransaction(data: InputTransactionDto) {
    /*
     * atomic transaction (ACID) - transaction and crash
     * if any update fails discard everything
     * $transaction && version
     */
    return this.prismaService.$transaction(async (prisma) => {
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: data.order_id },
      });

      await prisma.order.update({
        where: { id: data.order_id, version: order.version },
        data: {
          partial: order.partial - data.negotiated_shares,
          status: data.status,
          Transactions: {
            create: {
              broker_transaction_id: data.broker_transaction_id,
              related_investor_id: data.related_investor_id,
              shares: data.negotiated_shares,
              price: data.price,
            },
          },
          version: { increment: 1 },
        },
      });

      if (data.status == OrderStatus.CLOSED) {
        await prisma.asset.update({
          where: { id: order.asset_id },
          data: {
            price: data.price,
          },
        });

        const walletAsset = await prisma.walletAsset.findUnique({
          where: {
            wallet_id_asset_id: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
            },
          },
        });

        if (walletAsset) {
          await prisma.walletAsset.update({
            where: {
              wallet_id_asset_id: {
                asset_id: order.asset_id,
                wallet_id: order.wallet_id,
              },
              version: walletAsset.version,
            },
            data: {
              shares:
                order.type === OrderType.BUY
                  ? walletAsset.shares + order.shares
                  : walletAsset.shares - order.shares,
              version: { increment: 1 },
            },
          });
        } else {
          //só poderia adicionar na carteira se a ordem for de compra
          await prisma.walletAsset.create({
            data: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
              shares: data.negotiated_shares,
              version: 1,
            },
          });
        }
      }
    });
  }

  findAll({ wallet_id }: { wallet_id: string }) {
    return this.prismaService.order.findMany({
      where: {
        wallet_id,
      },
      include: {
        Transactions: true,
        Asset: {
          select: {
            id: true,
            symbol: true,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
