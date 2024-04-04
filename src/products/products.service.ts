import { Injectable, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid'; 
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 
  ) {}

  async createProduct( createProductDto: CreateProductDto, user: User ) {
  
    try {
      
      const product = this.productRepository.create({ 
        ...createProductDto,
        user
      });
      
      return await this.productRepository.save( product );  
      
    } catch ( error ) {
      console.log( error );
    }
  }

  async findAllProducts( paginationDto: PaginationDto, user: User ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        user: {
          id: user.id
        }
      }
    })

    return products;

  }

  async findProductByTerm( term: string ) {

    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product'); 
      product = await queryBuilder
        .where('UPPER(name) =:name', {   
          name: term.toUpperCase(),
        })
        .getOne(); 
    }

    if ( !product ) 
      throw new NotFoundException(`Product with the term ${ term } not found`); 

    return product;
  }


  async updateProduct( id: string, updateProductDto: UpdateProductDto ) {
    
    await this.findProductByTerm( id );

    try {
      const product = await this.productRepository.preload({ 
        id, 
        ...updateProductDto, 
      });

      return await this.productRepository.save( product );  

    } catch ( error ) {
      console.log( error );
    }
  }

  async deleteProduct( id: string ) {

    const product = await this.findProductByTerm( id ); 

    try {
      await this.productRepository.remove( product );

      return `Successful product removal`;
      
    } catch ( error ) {
      console.log( error );
    }
    
  }


    async deleteAllProducts() {
      const query = this.productRepository.createQueryBuilder('product'); 

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
