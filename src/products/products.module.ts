import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product-images.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SuppliersModule } from 'src/suppliers/suppliers.module';


@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService, ProductImagesService ],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),
    CloudinaryModule,
    PassportModule,
    AuthModule,
    JwtModule,
    SuppliersModule,
  ],
  exports: [
    TypeOrmModule,
    ProductsService
  ]
})
export class ProductsModule {}
