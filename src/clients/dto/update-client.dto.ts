import { IsNotEmpty, IsEmail, IsString } from 'class-validator';


export class UpdateClientDto {

    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsString()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email?: string;

}
