import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ ClientsController ],
  providers: [ ClientsService ],
  imports: [
    TypeOrmModule.forFeature([ Client ]),
    PassportModule,
    AuthModule,
    JwtModule,
    CommonModule
  ],
  exports: [
    TypeOrmModule,
    ClientsService
  ]
})
export class ClientsModule {}