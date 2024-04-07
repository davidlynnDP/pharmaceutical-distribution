import { IsOptional, IsString, IsEmail, Length } from 'class-validator';


export class UpdateSupplierDto {

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(1, 255) 
    address?: string;

    @IsOptional()
    @IsString()
    @Length(1, 100) 
    city?: string;

    @IsOptional()
    @IsString()
    @Length(1, 100) 
    country?: string;

    @IsOptional()
    @IsString()
    @Length(1, 20)
    postalCode?: string;

}
