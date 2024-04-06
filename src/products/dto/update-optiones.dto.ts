import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class UpdateOptionsDto {

    @IsOptional()
    @IsBoolean() 
    @Type( () => Boolean ) 
    deletePrevious?: boolean;

    @IsOptional()
    @IsString() 
    supplier?: string;

}