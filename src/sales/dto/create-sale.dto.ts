import { IsNotEmpty, IsInt, Min } from 'class-validator';


export class CreateSaleDto {

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    unitPrice: number;

}

