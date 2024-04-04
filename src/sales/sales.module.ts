import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale, SaleDetail } from './entities';

@Module({
  controllers: [ SalesController ],
  providers: [ SalesService ],
  imports: [
    TypeOrmModule.forFeature([ Sale, SaleDetail ]),
  ],
  exports: [
    TypeOrmModule,
  ]
})
export class SalesModule {}
