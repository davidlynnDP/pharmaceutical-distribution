import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';
import { CommonService } from 'src/common/common.service';


@Injectable()
export class ClientsService {

  constructor(

    @InjectRepository( Client )
    private readonly clientRepository: Repository<Client>,

    private readonly commonService: CommonService
  ) {}


  async createClient( createClientDto: CreateClientDto, user: User ) {

    try {
      
      const client = this.clientRepository.create({ 
        ...createClientDto,
        user
      });
      
      return await this.clientRepository.save( client );  

    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }

  }
  
  async findAllClients( paginationDto: PaginationDto, user: User ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const clients = await this.clientRepository.find({
      take: limit,   
      skip: offset, 
      where: {
        user: {
          id: user.id
        }
      } 
    })

    return clients;

  }

  async findClientByTerm( term: string ) {
    
    let client: Client;

    if ( isUUID( term ) ) {
      client = await this.clientRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.clientRepository.createQueryBuilder('client'); 
      client = await queryBuilder
        .where('email =:email or phone =:phone', {   
          email:  term.toLowerCase(),
          phone:  term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !client ) 
      throw new NotFoundException(`Client with the term ${ term } not found`); 

    return client;
  }


  async updateClient( id: string, updateclientDto: UpdateClientDto ) {
    
    await this.findClientByTerm( id );

    try {
      const client = await this.clientRepository.preload({ 
        id, 
        ...updateclientDto, 
      });

      return await this.clientRepository.save( client );  

    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }
  }


  async deleteClient( id: string ) {
    
    const client = await this.findClientByTerm( id ); 

    try {
      await this.clientRepository.remove( client );

      return `Successful client removal`;
      
    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }
    
  }

}
