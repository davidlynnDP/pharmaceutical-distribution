import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies';
import { jwtConstants } from 'src/constants';

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy ],
  imports: [

    ConfigModule, 

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
    
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy, 
    PassportModule, 
    JwtModule
  ]
})
export class AuthModule {}
