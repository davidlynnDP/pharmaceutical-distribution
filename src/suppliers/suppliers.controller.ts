import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';


@Controller('suppliers') // localhost:3000/api/suppliers
@UseGuards( AuthGuard() )
export class SuppliersController {

  constructor(
    private readonly suppliersService: SuppliersService
  ) {}

  // localhost:3000/api/suppliers/create - POST
  @Post('create')
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
    @GetUser() user: User
  ) {
    return await this.suppliersService.createSupplier( createSupplierDto, user );
  }

  // localhost:3000/api/suppliers/find - GET
  @Get('find')
  async findAllSuppliers(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return await this.suppliersService.findAllSuppliers( paginationDto, user );
  }

  // localhost:3000/api/suppliers/find/:id - GET
  @Get('find/:id')
  async findSupplierByTerm(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return await this.suppliersService.findSupplierByTerm( id );
  }

  // localhost:3000/api/suppliers/:id - PATCH
  @Patch(':id')
  async updateSupplier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto
  ) {
    return await this.suppliersService.updateSupplier( id, updateSupplierDto );
  }

  // localhost:3000/api/suppliers/:id - DELETE
  @Delete(':id')
  async deleteSupplier(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return await this.suppliersService.deleteSupplier( id );
  }
}
