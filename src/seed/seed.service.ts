import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities';
import { Supplier } from 'src/suppliers/entities';
import { Product } from 'src/products/entities';
import { Client } from 'src/clients/entities';
import { initialInformation } from './information';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 

    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>, 
  ) {}
  
  async loadInformationToDatabase() {

    try {

      await this.deleteAllTables();
      
      const user = await this.insertUsers();
      console.log( user );
      const supplier = await this.insertSuppliers( user );
      await this.insertClients( user );
      await this.insertProducts( user, supplier );
      
      return 'Database seeding completed successfully.'

  } catch ( error ) {
      console.log( error );
  }

  }

  private async insertUsers() {

    const seedUsers = initialInformation.users;
    
    const userPromises = seedUsers.map( user => this.userRepository.create( user ) );

    const dbUsers = await Promise.all( userPromises.map( user => this.userRepository.save( user ) ) );

    return dbUsers[0];
  }

  
  private async insertSuppliers( user: User ) {

    const seedSuppliers = initialInformation.suppliers;
    
    const supplierPromises = seedSuppliers.map( supplier => this.supplierRepository.create({ ...supplier, user }) );

    const dbSuppliers = await Promise.all( supplierPromises.map( supplier => this.supplierRepository.save( supplier ) ) );

    return dbSuppliers[0];
  }

  private async insertClients( user: User ) {

    const seedClients = initialInformation.clients;

    const clientPromises = seedClients.map( client => this.clientRepository.create({ ...client, user }));

    await Promise.all( clientPromises.map( client => this.clientRepository.save( client ) ) );

    return true;
  }

  private async insertProducts( user: User, supplier: Supplier ) {

    const seedProducts = initialInformation.products;

    const productPromises = seedProducts.map( product => this.productRepository.create({ ...product, user, supplier }));

    await Promise.all( productPromises.map( product => this.productRepository.save( product ) ) );

    return true;
  }


  private async deleteAllTables() {

    await this.deleteAllProducts();
    await this.deleteAllClients();
    await this.deleteAllSuppliers();
    await this.deleteAllUsers();

  }

  private async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      console.log( error );
    }
  }

  private async deleteAllClients() {
    const query = this.clientRepository.createQueryBuilder('client'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      console.log( error );
    }
  }

  private async deleteAllSuppliers() {
    const query = this.supplierRepository.createQueryBuilder('supplier'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      console.log( error );
    }
  }

  private async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      console.log( error );
    }
  }
}
