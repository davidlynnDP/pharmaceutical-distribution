import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';


@Entity({ name: 'sales_details' })
export class SaleDetail {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column()
    unitPrice: number;

    @Column()
    total: number; // (quantity * unitPrice).

    
    @ManyToOne(
        () => Product,
        ( product ) => product.saleDetails,
        /* opciones */
    )
    product: Product;

    @ManyToOne(
        () => Sale,
        ( sale ) => sale.saleDetails,
        /* opciones */
    )
    sale: Sale;


    @BeforeInsert()
    calculateTotalInsert() {
        this.total = this.quantity * this.unitPrice;
    }
    
    @BeforeUpdate()
    calculateTotalUpdate() {
        this.total = this.quantity * this.unitPrice;
    }

}