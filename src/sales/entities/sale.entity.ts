import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SaleDetail } from './';
import { User } from 'src/auth/entities';
import { Client } from 'src/clients/entities';

@Entity({ name: 'sales' })
export class Sale {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    @Column()
    saleDate: string;


    @OneToMany(
        () => SaleDetail,
        ( saleDetail ) => saleDetail.sale,
        /* opciones */
    )
    saleDetails: SaleDetail[];

    @ManyToOne(
        () => User,
        ( user ) => user.sales,
        /* opciones */
    )
    user: User;

    @ManyToOne(
        () => Client,
        ( client ) => client.sales,
        /* opciones */
    )
    client: Client;


    @BeforeInsert()
    checkDateInsert() {

        if ( !this.saleDate ) {
            const date = new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            this.saleDate = date;
        }

    }

    @BeforeUpdate()
    checkDateUpdate() {

        const date = new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        this.saleDate = date;

    }
}
