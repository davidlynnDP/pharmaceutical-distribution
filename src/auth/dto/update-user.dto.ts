import { IsNotEmpty, IsEmail, IsString } from 'class-validator';


export class UpdateUserDto {

    @IsNotEmpty()
    @IsString()
    username?: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email?: string;

}
