import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Sale } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients/clients.service';
import { ClientQueryDto, CreateSaleDto } from './dto';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';
import { validate as isUUID } from 'uuid'; 
import { SaleDetailsService } from './sale-details.service';


@Injectable()
export class SalesService {

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @Inject(forwardRef(() => SaleDetailsService))
    private readonly saleDetailsService: SaleDetailsService,
    
    private readonly clientsService: ClientsService,
  ) {}

  async createSale( createSaleDto: CreateSaleDto, user: User, clientQueryDto: ClientQueryDto ) {

    const { client } = clientQueryDto;
    const clientTo = await this.clientsService.findClientByTerm( client );

    try {
      
      const sale = this.saleRepository.create({ 
        user,
        client: clientTo
      });

      const savedSale = await this.saleRepository.save( sale );

      if ( createSaleDto.items.length > 0 ) {
        const saleDetails = await this.saleDetailsService.createSaleDetail( savedSale.id, createSaleDto );
        savedSale.saleDetails = saleDetails;
        await this.saleRepository.save( savedSale );
      }

      return 'Sale created';

    } catch ( error ) {
      console.log( error );
    }

  }

  async findAllSales( paginationDto: PaginationDto, user: User ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const sales = await this.saleRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        user: {
          id: user.id
        }
      },
      relations: {
        client: true,
        saleDetails: true
      }
    })

    return sales;

  }

  async findSaleById( id: string ) {

    let sale: Sale;

    if ( !isUUID( id ) ) {
      throw new BadRequestException(`Invalid UUID format for sale id: ${ id }`);
    }

    sale = await this.saleRepository.findOne({
      where: {
        id
      },
      relations: {
        client: true,
        saleDetails: true
      }
    });

    if ( !sale ) 
      throw new NotFoundException(`Sale with the id '${ id }' was not found.`);

    return sale;
  }
  
}
