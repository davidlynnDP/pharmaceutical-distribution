import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

//@UseGuards( JwtAuthGuard )
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {

  constructor(
    @InjectRepository( User )  
    private readonly userRepository: Repository<User>,  
    
    private readonly jwtService: JwtService
  ) {
    super();
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const authenticationToken = this.extractTokenFromHeader( request );

    try {
      const { id } = this.jwtService.verify( authenticationToken );

      const user = await this.userRepository.findOneBy({ id });

      if ( !user ) 
          throw new UnauthorizedException('Token not valid') 
          
      if ( !user.isActive ) 
          throw new UnauthorizedException('User is inactive, talk with an admin');  

      request.user = user; 
      return true;

    } catch ( error ) {
      throw new UnauthorizedException('Unauthorized');
    }
    
  }

  private extractTokenFromHeader( request: Request ): string | undefined {
    const [ type, token ] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  
}
