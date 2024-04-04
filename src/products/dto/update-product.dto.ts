import { IsOptional, IsString, IsInt, Min, IsPositive } from 'class-validator';



export class UpdateProductDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    stocks?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @IsPositive()
    price?: number;

}
