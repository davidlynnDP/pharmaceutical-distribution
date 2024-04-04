import { IsOptional, IsInt, Min } from 'class-validator';


export class UpdateSaleDto {

    @IsOptional()
    @IsInt()
    @Min(1)
    quantity?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    unitPrice?: number;

}
