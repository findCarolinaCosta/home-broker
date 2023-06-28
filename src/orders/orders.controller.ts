import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InitTransactionDto } from './dto/init-transaction.dto';
import { InputTransactionDto } from './dto/input-transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExecuteTransactionMessage } from './dto/execute-transaction-message.dto';

@Controller('wallets/:wallet_id/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  initTransaction(
    @Param('wallet_id') wallet_id: string,
    @Body() createOrderDto: Omit<InitTransactionDto, 'wallet_id'>,
  ) {
    return this.ordersService.initTransaction({
      wallet_id,
      ...createOrderDto,
    });
  }

  @Post('execute')
  executeTransactionRest(@Body() createOrderDto: InputTransactionDto) {
    return this.ordersService.executeTransaction(createOrderDto);
  }

  @Get()
  findAll(@Param('wallet_id') wallet_id: string) {
    return this.ordersService.findAll({ wallet_id });
  }

  @MessagePattern('output')
  async executeTransactionConsumer(
    @Payload() message: ExecuteTransactionMessage,
  ) {
    const transaction = message.transactions[message.transactions.length - 1];
    console.log(transaction);
    await this.ordersService.executeTransaction({
      order_id: message.order_id,
      status: message.status,
      related_investor_id:
        message.order_type === 'BUY'
          ? transaction.seller_id
          : transaction.buyer_id,
      broker_transaction_id: transaction.transaction_id,
      negotiated_shares: transaction.shares,
      price: transaction.price,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
