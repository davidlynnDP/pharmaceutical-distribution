import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('clients') // localhost:3000/api/clients
@UseGuards( AuthGuard() )
export class ClientsController {

  constructor(
    private readonly clientsService: ClientsService
  ) {}

  // localhost:3000/api/clients/create - POST
  @Post('create')
  async createClient(
    @Body() createClientDto: CreateClientDto, 
    @GetUser() user: User
  ) {
    return await this.clientsService.createClient( createClientDto, user);
  }

  // localhost:3000/api/clients/find - GET
  @Get('find')
  async findAllClients(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return await this.clientsService.findAllClients( paginationDto, user );
  }

  // localhost:3000/api/clients/find/:id - GET
  @Get('find/:id')
  async findClientByTerm(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return await this.clientsService.findClientByTerm( id );
  }

  // localhost:3000/api/clients/:id - PATCH
  @Patch(':id')
  async updateClient(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return await this.clientsService.updateClient( id, updateClientDto );
  }

  // localhost:3000/api/clients/:id - DELETE
  @Delete(':id')
  async deleteClient(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return await this.clientsService.deleteClient( id );
  }

}
