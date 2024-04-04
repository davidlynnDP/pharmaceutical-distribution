import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';


@Injectable()
export class SuppliersService {

  
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>, 
  ) {}


  async createSupplier( createSupplierDto: CreateSupplierDto, user: User ) {

    try {
      
      const supplier = this.supplierRepository.create({ 
        ...createSupplierDto,
        user
      });
      
      return await this.supplierRepository.save( supplier );  

    } catch ( error ) {
      console.log( error );
    }
  }

  
  async findAllSuppliers( paginationDto: PaginationDto, user: User ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const suppliers = await this.supplierRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        user: {
          id: user.id
        }
      }
    })

    return suppliers;

  }

  async findSupplierByTerm( term: string ) {
    
    let supplier: Supplier;

    if ( isUUID( term ) ) {
      supplier = await this.supplierRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.supplierRepository.createQueryBuilder('supplier'); 
      supplier = await queryBuilder
        .where('email =:email or phone =:phone', {   
          email:  term.toLowerCase(),
          phone:  term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !supplier ) 
      throw new NotFoundException(`Supplier with the term ${ term } not found`); 

    return supplier;
  }

  async updateSupplier( id: string, updateSupplierDto: UpdateSupplierDto ) {
    
    await this.findSupplierByTerm( id );

    try {
      const supplier = await this.supplierRepository.preload({ 
        id, 
        ...updateSupplierDto, 
      });

      return await this.supplierRepository.save( supplier );  

    } catch ( error ) {
      console.log( error );
    }
  }


  async deleteSupplier( id: string ) {
    
    const product = await this.findSupplierByTerm( id ); 

    try {
      await this.supplierRepository.remove( product );

      return `Successful supplier removal`;
      
    } catch ( error ) {
      console.log( error );
    }
    
  }

  async deleteAllSuppliers() {

    const query = this.supplierRepository.createQueryBuilder('supplier'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      console.log( error );
    }
  }
  
}
