import { Controller, Get, Post, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { AdminAuthGuard } from 'src/auth/admin/admin.guard';
import { FindTransactionDto } from './dto/find-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Request() req: JWTRequest, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(req, createTransactionDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  findAll(@Query() params: FindTransactionDto) {
    return this.transactionService.findAll(params);
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
