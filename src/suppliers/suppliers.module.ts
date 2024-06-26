import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ SuppliersController ],
  providers: [ SuppliersService ],
  imports: [
    TypeOrmModule.forFeature([ Supplier ]),
    PassportModule,
    AuthModule,
    JwtModule,
    CommonModule
  ],
  exports: [
    TypeOrmModule,
    SuppliersService
  ]
})
export class SuppliersModule {}
