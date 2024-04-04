import { User } from 'src/auth/entities';
import { Sale } from 'src/sales/entities';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'clients' })
export class Client {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    registrationDate: string;


    @ManyToOne(
        () => User,
        ( user ) => user.clients,
        /* opciones */
    )
    user: User;

    @OneToMany(
        () => Sale,
        ( sale ) => sale.client,
        /* opciones */
    )
    sales: Sale[];


    @BeforeInsert()
    checkRegistrationDateInsert() {

        if ( !this.registrationDate ) {
            const date = new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            this.registrationDate = date;
        }

    }

}
