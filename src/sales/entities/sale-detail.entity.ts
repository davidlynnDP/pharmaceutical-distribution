import { Product } from 'src/products/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';


@Entity({ name: 'sales_details' })
export class SaleDetail {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column()
    total: number; // (quantity * unitPrice).

    
    @ManyToOne(
        () => Product,
        ( product ) => product.saleDetails,
        { eager: true }
    )
    product: Product;

    @ManyToOne(
        () => Sale,
        ( sale ) => sale.saleDetails,
        { onDelete: 'CASCADE' }  
    )
    sale: Sale;

}