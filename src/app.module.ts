import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'user_crud',
      password: 'root',
      database: 'db_crud',
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    ProductsModule,
    
    SuppliersModule,
    
    SalesModule,
    
    AuthModule,
    
    ClientsModule,
    
    CloudinaryModule,
    
    CommonModule,
    
    SeedModule,
    
  ],
})
export class AppModule {}
