import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';
import { ProductsModule } from 'src/products/products.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { SalesModule } from 'src/sales/sales.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ SeedController ],
  providers: [ SeedService ],
  imports: [
    AuthModule,
    ClientsModule,
    ProductsModule,
    SuppliersModule,
    SalesModule,
    CommonModule
  ]
})
export class SeedModule {}
