import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities';

@Module({
  controllers: [ SuppliersController ],
  providers: [ SuppliersService ],
  imports: [
    TypeOrmModule.forFeature([ Supplier ]),
  ],
  exports: [
    TypeOrmModule,
  ]
})
export class SuppliersModule {}
