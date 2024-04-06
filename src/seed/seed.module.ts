import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';
import { ProductsModule } from 'src/products/products.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';

@Module({
  controllers: [ SeedController ],
  providers: [ SeedService ],
  imports: [
    AuthModule,
    ClientsModule,
    ProductsModule,
    SuppliersModule 
  ]
})
export class SeedModule {}
