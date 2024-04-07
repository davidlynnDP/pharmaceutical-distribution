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

// {
//   "items": [
//     {
//       "productId": "2a071fef-48fd-497d-a9f1-07b785087f89",
//       "quantity": 2
//     },
//     {
//       "productId": "725b8978-6d67-47cc-ad31-68978ef90f29",
//       "quantity": 1
//     },
//     {
//       "productId": "740ea108-6037-4f56-95ee-61d1fcd5af4e",
//       "quantity": 3
//     },
//     {
//       "productId": "8fd9a383-c165-46f8-bcf6-7281abb41868",
//       "quantity": 2
//     },
//     {
//       "productId": "ac36091b-5173-45ad-987a-fc33f2f76692",
//       "quantity": 1
//     }
//   ]
// }
