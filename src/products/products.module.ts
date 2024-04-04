import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product-images.service';

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService, ProductImagesService ],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),
  ],
  exports: [
    TypeOrmModule,
  ]
})
export class ProductsModule {}
