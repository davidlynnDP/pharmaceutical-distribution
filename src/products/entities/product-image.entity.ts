import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';


@Entity({ name: 'product_images' }) 
export class ProductImage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    
    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        /* opciones */ 
    )
    product: Product;

}