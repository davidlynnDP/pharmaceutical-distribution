import { SaleDetail } from 'src/sales/entities';
import { Supplier } from 'src/suppliers/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities';


@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    description: string;

    // @Column({
    //     type: 'text',
    // })
    // barcode: string;

    @Column()
    stocks: number;

    @Column()
    price: number;


    @ManyToOne(
        () => User,
        ( user ) => user.products,
        /* opciones */
    )
    user: User;

    @ManyToOne(
        () => Supplier,
        ( supplier ) => supplier.products,
        /* opciones */
    )
    supplier: Supplier;

    @OneToMany(
        () => SaleDetail,
        ( saleDetail ) => saleDetail.product,
        /* opciones */
    )
    saleDetails: SaleDetail[];

    @OneToMany( 
        () => ProductImage,
        ( productImage ) => productImage.product, 
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.name;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate() 
    checkSlugUpdate() {

        this.slug = this.name
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
}
