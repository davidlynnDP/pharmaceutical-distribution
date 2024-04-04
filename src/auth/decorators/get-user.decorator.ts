import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities';


export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user as User;
    
        if (!user) {
          throw new InternalServerErrorException('User not found in (request)');
        }
    
        return user;
    }
);
