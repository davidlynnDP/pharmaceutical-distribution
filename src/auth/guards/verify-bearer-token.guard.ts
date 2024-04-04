import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

//@UseGuards( JwtAuthGuard )
@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const request = context.switchToHttp().getRequest();
    this.extractTokenFromHeader( request );
    const authorizationHeader = request.headers['authorization'];
    console.log( authorizationHeader );

    if ( !authorizationHeader || !authorizationHeader.startsWith('Bearer ') ) {
      return false;
    }

    const token = authorizationHeader.split(' ')[1];

    try {

      const decoded = this.jwtService.verify( token );
      console.log( decoded );
      return true;

    } catch ( error ) {

      return false;
    }
  }

  private extractTokenFromHeader(request: Request) {
    console.log( request.headers ); 
  }

  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [ type, token ] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }

  
}
