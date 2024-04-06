import { Controller, Get, Post, Body, Param, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';
import { ClientQueryDto } from './dto';

@Controller('sales') //localhost:3000/api/sales
@UseGuards( JwtAuthGuard )
export class SalesController {
  
  constructor(
    private readonly salesService: SalesService
  ) {}

  // localhost:3000/api/sales/create - POST
  @Post('create')
  async createSale(
    @Body() createSaleDto: CreateSaleDto,
    @GetUser() user: User,
    @Query() clientQueryDto: ClientQueryDto,
  ) {
    return await this.salesService.createSale( createSaleDto, user, clientQueryDto );
  }

  // localhost:3000/api/sales/find - GET
  @Get('find')
  async findAllSales(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return await this.salesService.findAllSales( paginationDto, user );
  }

  // localhost:3000/api/sales/find/:id - GET
  @Get('find/:id')
  async findSaleById(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return await this.salesService.findSaleById( id );
  }

}
