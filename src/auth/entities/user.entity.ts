import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Client } from "src/clients/entities";
import { Product } from "src/products/entities";
import { Sale } from "src/sales/entities";
import { Supplier } from "src/suppliers/entities";


@Entity({ name: 'users' })
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({
        default: true
    })
    isActive: boolean;

    @OneToMany( 
        () => Product,
        ( product ) => product.user, 
        /* opciones */
    )
    products: Product[];

    @OneToMany( 
        () => Supplier,
        ( supplier ) => supplier.user, 
        /* opciones */
    )
    suppliers: Supplier[];

    @OneToMany( 
        () => Client,
        ( client ) => client.user, 
        /* opciones */
    )
    clients: Client[]; 

    @OneToMany( 
        () => Sale,
        ( sale ) => sale.user, 
        /* opciones */
    )
    sales: Sale[];

}
