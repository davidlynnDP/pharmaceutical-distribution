import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class CommonService {

  private readonly logger = new Logger('CommonService');

  constructor( 

    /* dependencias */
    
  ) {}

  globalErrorHandler( error ) {

    console.log( error )
    this.logger.error( error );

  }

}
