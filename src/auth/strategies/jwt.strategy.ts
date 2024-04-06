import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces';
import { jwtConstants } from 'src/constants';


@Injectable()  
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( User )  
        private readonly userRepository: Repository<User>,  
    ) {

        super({
            secretOrKey: jwtConstants.secret,   
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
        });
    }

    

    async validate( payload: JwtPayload ) {  
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) 
            throw new UnauthorizedException('Token not valid') 
            
        if ( !user.isActive ) 
            throw new UnauthorizedException('User is inactive, talk with an admin');  

        return user; //req.user
    }

}