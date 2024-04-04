import { IsNotEmpty, IsString, IsInt, Min, IsPositive } from 'class-validator';



export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    stocks: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @IsPositive()
    price: number;
    
}
