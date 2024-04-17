import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { validate as isUUID } from 'uuid'; 
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';
import { SupplierQueryDto, UpdateOptionsDto } from './dto';
import { ProductImagesService } from './product-images.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { CommonService } from 'src/common/common.service';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 

    //ciclo de dependencia
    @Inject(forwardRef(() => ProductImagesService))
    private readonly productImagesService: ProductImagesService, 

    private readonly suppliersService: SuppliersService,

    private readonly commonService: CommonService
  ) {}

  async createProduct( createProductDto: CreateProductDto, user: User, supplierQueryDto: SupplierQueryDto, files: Express.Multer.File[] ) {
  
    const { supplier } = supplierQueryDto;
    const supplierTo = await this.suppliersService.findSupplierByTerm( supplier );

    try {
      
      const product = this.productRepository.create({ 
        ...createProductDto,
        user,
        supplier: supplierTo
      });

      const savedProduct = await this.productRepository.save( product );

      if ( files && files.length > 0 ) {
        const images = await this.productImagesService.createProductWithMultipleImages( savedProduct.id, files );
        savedProduct.images = images;
    }

    await this.productRepository.save( savedProduct );

    return 'Successfully created product';
      
    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
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
      },
      relations: {
        images: true,
        supplier: true
      }
    })

    const transformedProducts = products.map( product => ({
      ...product,
      images: product.images.map( image => ({
        id: image.id,
        url: image.url,
      })),
    }));

    return transformedProducts;

  }

  async findProductByTerm( term: string ) {

    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOne({
        where: {
          id: term
        },
        relations: {
          images: true,
          supplier: true
        }
      });
    } else {
      product = await this.productRepository.findOne({
        where: { 
          name: term 
        },
        relations: {
          images: true,
          supplier: true
        }
      });
    }

    if ( !product ) 
      throw new NotFoundException(`Product with the term ${ term } not found`); 

    return product;
  }


  async updateProduct( id: string, updateProductDto: UpdateProductDto, files: Express.Multer.File[], updateOptionsDto: UpdateOptionsDto ) {
    
    const { deletePrevious = false, supplier } = updateOptionsDto;

    let supplierTo;

    if ( supplier ) {
      supplierTo = await this.suppliersService.findSupplierByTerm( supplier );
    }
    await this.findProductByTerm( id );

    try {
      
      if ( deletePrevious ) {
        await this.productImagesService.deleteProductImages( id );
      }

      if ( files && files.length > 0 ) {

        const images = await this.productImagesService.createProductWithMultipleImages( id, files );

        const product = await this.productRepository.preload({
          id,
          ...updateProductDto,
          images,
          supplier: supplierTo
        });

        await this.productRepository.save( product );

        return 'Successfully updated product';
      }

      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
        supplier: supplierTo
      });

      await this.productRepository.save( product );

      return 'Successfully updated product';

    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }
  }

  async updateAlreadySoldProduct( id: string, product: Product ) {

    await this.findProductByTerm( id );

    const productTo = await this.productRepository.preload({
      id,
      ...product
    });

    await this.productRepository.save( productTo );

    return 'Successfully updated product';

  }

  async deleteProduct( id: string ) {

    const product = await this.findProductByTerm( id ); 

    try {
      await this.productRepository.remove( product );

      return `Successfully deleted product`;
      
    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }
    
  }
    
}
