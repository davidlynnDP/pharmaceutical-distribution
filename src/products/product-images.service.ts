import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { validate as isUUID } from 'uuid'; 

import { ProductImage } from "./entities";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { ProductsService } from "./products.service";
import { DeleteFileDto, DeleteFilesDto } from "./dto";
import { PaginationDto } from "src/common/dto";
import { CommonService } from "src/common/common.service";


@Injectable()
export class ProductImagesService {

    constructor(
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>, 

        private readonly cloudinaryService: CloudinaryService,

        @Inject(forwardRef(() => ProductsService))
        private readonly productsService: ProductsService,

        private readonly commonService: CommonService
      ) {}

    async createProductWithMultipleImages( id: string, files: Express.Multer.File[] ) {

      if ( !id ) {
        throw new Error(`product id not specified`);
      }

      if ( !files ) {
        throw new Error(`No images files specified`);
      }

      const product = await this.productsService.findProductByTerm( id );

      const responseCloudinary = await this.cloudinaryService.uploadMultipleFiles( files );

      const hasError = this.cloudinaryService.cloudinaryMultipleResponseErrorHandling( responseCloudinary );

      if ( hasError ) {
        throw new Error(`Failed to upload files to Cloudinary`);
      }

      const productImages: ProductImage[] = [];

      responseCloudinary.forEach( ({ secure_url }) => {
        productImages.push( this.productImageRepository.create({
          url: secure_url,
          product
        }))  
      });
  
      return await this.productImageRepository.save( productImages ) 
    }

    
    async createProductWithSingleImage( id: string, file: Express.Multer.File ) {

      if ( !id ) {
        throw new Error(`product id not specified`);
      }

      if ( !file ) {
        throw new Error(`No image file specified`);
      }

      const product = await this.productsService.findProductByTerm( id );

      const responseCloudinary = await this.cloudinaryService.uploadSingleFile( file );

      const hasError = this.cloudinaryService.cloudinarySingleResponseErrorHandling( responseCloudinary );

      if ( hasError ) {
          throw new Error(`Failed to upload file to Cloudinary`);
      }

      const productImages = await this.productImageRepository.create({
          url: responseCloudinary.secure_url,
          product
      });
      
      return await this.productImageRepository.save( productImages );  
    }


    async deleteProductImages( id: string ) {

      const product = await this.productsService.findProductByTerm( id );

      for (const image of product.images) {

        const imageId = this.cloudinaryService.getIdFromSecureURL( image.url ); //url
        await this.cloudinaryService.deleteSingleFile( imageId );
        
        await this.productImageRepository.delete( image.id );
      }

      return `Deletion of product images with id ${ product.id } successful`;

    }


    async deleteSingleImage( deleteFileDto: DeleteFileDto ): Promise<string> {

      const { secureUrl } = deleteFileDto; 

      try {

        const imageId = this.cloudinaryService.getIdFromSecureURL( secureUrl );

        await this.cloudinaryService.deleteSingleFile( imageId );
  
        const image: ProductImage = await this.findImageBySecureUrl( secureUrl );
  
        await this.productImageRepository.remove( image );

        return `Product image successfully removed`
        
      } catch ( error ) {
        this.commonService.globalErrorHandler( error );
      }

    }

    async deleteMultipleImages( deleteFilesDto: DeleteFilesDto ): Promise<string>  {

      const { secureUrls } = deleteFilesDto;

      try {

        
        const imageIds = this.cloudinaryService.getIdsFromMultipleSecureURL( secureUrls );

        await this.cloudinaryService.deleteMultipleFilesById( imageIds );
    
        const images: ProductImage[] = await this.productImageRepository.find({  
          where: {
            id: In( imageIds )
          },
        });
        await this.productImageRepository.remove( images );

        return `Product images successfully removed`;
        
      } catch ( error ) {
        this.commonService.globalErrorHandler( error );
      }

    }


    async findImageBySecureUrl( secureUrl: string ) {

      let image: ProductImage;

      if ( isUUID( secureUrl ) ) {
        image = await this.productImageRepository.findOneBy({ id: secureUrl });
      } else {
        image = await this.productImageRepository.findOneBy({ url: secureUrl })
      }
    
      if ( !image ) 
        throw new NotFoundException(`Image with the url ${ secureUrl } not found`); 
  
      return image;
    }
    

    async findAllImages( id: string, paginationDto: PaginationDto ) {
    
      const { limit = 10, offset = 0 } = paginationDto;
      const product = await this.productsService.findProductByTerm( id );
  
      const productImages = await this.productImageRepository.find({
        take: limit,   
        skip: offset, 
        where: {
          product: {
            id: product.id
          }
        }
      })
  
      return productImages.map( ({ id, url }) => ({
        id,
        url
      }))
    }

}