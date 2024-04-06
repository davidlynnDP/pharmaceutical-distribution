import { IsString } from 'class-validator'; 


export class ClientQueryDto {

    @IsString() 
    client: string;

}