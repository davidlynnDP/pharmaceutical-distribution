import { User } from 'src/auth/entities';
import { Product } from 'src/products/entities';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';



@Entity({ name: 'suppliers' })
export class Supplier {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    postalCode: string;


    @ManyToOne(
        () => User,
        ( user ) => user.suppliers,
        /* opciones */
    )
    user: User;

    @OneToMany(
        () => Product,
        ( product ) => product.supplier,
        /* opciones */
    )
    products: Product[];

}
