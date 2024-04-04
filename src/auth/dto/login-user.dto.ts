import { IsNotEmpty, IsEmail, IsString } from 'class-validator';


export class LoginUserDto {

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

}
