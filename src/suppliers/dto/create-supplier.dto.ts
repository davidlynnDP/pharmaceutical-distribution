import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class CreateSupplierDto {

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255) // Limita la longitud del address a entre 1 y 255 caracteres
    address: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100) // Limita la longitud de city a entre 1 y 100 caracteres
    city: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100) // Limita la longitud de country a entre 1 y 100 caracteres
    country: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 20) // Limita la longitud de postalCode a entre 1 y 20 caracteres
    postalCode: string;
    
}
