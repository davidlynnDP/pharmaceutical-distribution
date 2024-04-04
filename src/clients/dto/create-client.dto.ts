import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateClientDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}
