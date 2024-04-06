import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductItemDto {

  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

}

export class CreateSaleDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type( () => ProductItemDto )
  items: ProductItemDto[];

}
