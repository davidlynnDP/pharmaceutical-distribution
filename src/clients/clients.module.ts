import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ ClientsController ],
  providers: [ ClientsService ],
  imports: [
    TypeOrmModule.forFeature([ Client ]),
  ],
  exports: [
    TypeOrmModule,
  ]
})
export class ClientsModule {}