import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Patch, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { GetUser } from './decorators';
import { User } from './entities';
import { JwtAuthGuard } from './guards';

// localhost:3000/api/auth
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  // localhost:3000/api/auth/register - POST
  @Post('register')
  async registerNewUser(
    @Body() createUserDto: CreateUserDto
  ) {
    return await this.authService.registerNewUser( createUserDto );
  }

  // localhost:3000/api/auth/login - POST
  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto
  ) {
    return await this.authService.loginUser(loginUserDto);
  }

  // localhost:3000/api/auth/check-auth-status - GET
  @Get('check-auth-status')
  @UseGuards( JwtAuthGuard )
  async checkAuthStatus(
    @GetUser() user: User
  ) {
    return await this.authService.checkAuthStatus( user );
  }

  // localhost:3000/api/auth/find/:id - GET
  @Get('find/:id')
  @UseGuards( JwtAuthGuard )
  async findUserByIdOrEmail(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return await this.authService.findUserByIdOrEmail( id );
  }

  // localhost:3000/api/auth/:id - PATCH
  @Patch(':id')
  @UseGuards( JwtAuthGuard )
  async updateUser(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.authService.updateUser( id, updateUserDto );
  }

  // localhost:3000/api/auth/:id - DELETE
  @Delete(':id')
  @UseGuards( JwtAuthGuard )
  async deleteUser(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return await this.authService.deleteUser( id );
  }
}
