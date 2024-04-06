import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale, SaleDetail } from './entities';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule } from 'src/clients/clients.module';
import { SaleDetailsService } from './sale-details.service';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ SalesController ],
  providers: [ SalesService, SaleDetailsService ],
  imports: [
    TypeOrmModule.forFeature([ Sale, SaleDetail ]),
    PassportModule,
    AuthModule,
    JwtModule,
    ClientsModule,
    ProductsModule
  ],
  exports: [
    TypeOrmModule
  ]
})
export class SalesModule {}
