import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';


export interface DatabaseErrorsTypes {
  code?: string;
  detail?: string;
  table?: string;
}

export enum ErrorCodes {
  duplicatedKey = '23505',
}


@Injectable()
export class CommonService {

  private readonly logger = new Logger('CommonService');

  globalErrorHandler( error: DatabaseErrorsTypes ): void {

    console.log( error )
    this.logger.error( error );

    switch ( error.code ) {

      //custom errors

      default:
        throw new InternalServerErrorException('Unexpected error, check the server logs!'); 
      }
  }

}
