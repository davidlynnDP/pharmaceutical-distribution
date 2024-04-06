import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';


// localhost:3000/api/seed
@Controller('seed')
export class SeedController {

  constructor(
    private readonly seedService: SeedService
  ) {}

  @Get('execute')  // localhost:3000/api/seed/execute
  loadInformationToDatabase() {
    return this.seedService.loadInformationToDatabase();
  }
}
