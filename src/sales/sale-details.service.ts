import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { SaleDetail } from "./entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateSaleDto } from "./dto";
import { ProductsService } from "src/products/products.service";
import { SalesService } from "./sales.service";


@Injectable()
export class SaleDetailsService {

    constructor(
      @InjectRepository(SaleDetail)
      private readonly saleDetailRepository: Repository<SaleDetail>,

      private readonly productsService: ProductsService,

      @Inject(forwardRef(() => SalesService))
      private readonly salesService: SalesService
    ) {}

    async createSaleDetail( id: string, createSaleDto: CreateSaleDto ): Promise<SaleDetail[]> {

        const sale = await this.salesService.findSaleById( id );

        const productPromises = createSaleDto.items.map( async({ productId, quantity }) => {

          const product = await this.productsService.findProductByTerm( productId );
          
          if (!product) {
            throw new NotFoundException(`Product with ID '${ productId }' not found.`);
          }

          const total = quantity * product.price;

          const saleDetail = this.saleDetailRepository.create({
            quantity,
            total,
            product,
            sale
          });

          const saleDetailSaved = await this.saleDetailRepository.save( saleDetail );

          product.stocks -= quantity;
          await this.productsService.updateAlreadySoldProduct( product.id, product );
          return saleDetailSaved;
        });
    
        return await Promise.all( productPromises );
    }
    
}