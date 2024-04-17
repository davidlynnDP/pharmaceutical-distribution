import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { validate as isUUID } from 'uuid';


import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities';
import { JwtPayload } from './interfaces';
import { CommonService } from 'src/common/common.service';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,

    private readonly commonService: CommonService,

    private readonly jwtService: JwtService, 
  ) {}

  
  async registerNewUser( createUserDto: CreateUserDto ) {

    try {

      const { password, ...userData } = createUserDto;
      const salt = bcrypt.genSaltSync( 10 );

      const user = this.userRepository.create({ 
        ...userData,
        password: bcrypt.hashSync( password, salt ) 
      });

      await this.userRepository.save( user )  
      delete user.password;                 

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })  
      };

    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }
  }

  async loginUser( loginUserDto: LoginUserDto ) {
    
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },  
      select: { email: true, password: true, id: true }      
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');  
      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete user.password;     

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }) 
    };

  }
  
  async checkAuthStatus( user: User ){

    return {
      ...user,   
      token: this.getJwtToken({ id: user.id }) 
    };

  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload ); 
    return token;

  }

  async findUserByIdOrEmail( term: string ) {

    let user: User;

    if ( isUUID( term ) ) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      user = await this.userRepository.findOneBy({ email: term });
    }

    if ( !user ) 
      throw new NotFoundException(`User with ${ term } not found`);

    return user;
  }

  async updateUser( id: string, updateUserDto: UpdateUserDto ) {
    
    await this.findUserByIdOrEmail( id );

    try {

      const user = await this.userRepository.preload({ 
        id, 
        ...updateUserDto 
      }); 

      await this.userRepository.save( user );  

      return 'Successfully updated user';

    } catch ( error ) {
      this.commonService.globalErrorHandler( error );
    }
  }

  async deleteUser( id: string ) {

    const user = await this.userRepository.findOneBy({ id });

    if ( !user ) {
      throw new NotFoundException(`User with id ${ id } not found`);
    }
  
    user.isActive = false;
  
    this.userRepository.save( user );

    return 'Successfully deleted user (isActive:false)'
  }

}
