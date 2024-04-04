import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './types';
const streamifier = require('streamifier');


type CloudinaryDeleteResources = {
  deleted: {
    [key: string]: string;
  };
  partial: boolean;
};


@Injectable()
export class CloudinaryService {

  uploadSingleFile( file: Express.Multer.File ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>( ( resolve, reject ) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        ( error, result ) => {
          if ( error ) return reject( error );
          resolve( result );
        },
      );

      streamifier.createReadStream( file.buffer ).pipe( uploadStream );
    });
  }

  async uploadMultipleFiles( files: Express.Multer.File[] ): Promise<CloudinaryResponse[]> {

    const uploadPromises: Promise<CloudinaryResponse>[] = [];

    for ( const file of files ) {
      const uploadPromise = this.uploadSingleFile( file );
      uploadPromises.push( uploadPromise );
    }

    return await Promise.all( uploadPromises );
  }

  async deleteSingleFile( imageId: string ): Promise<"ok"> {

    const { result } = await cloudinary.uploader.destroy( imageId, {
      resource_type: 'image',
    });

    if ( result !== 'ok' ) throw new Error(`Wrong deletion`);

    return result;
  }

  async deleteMultipleFilesById( imageIds: string[] ): Promise<CloudinaryDeleteResources> {
    const deleteResponse: CloudinaryDeleteResources = await cloudinary.api.delete_resources( imageIds, {
      resource_type: 'image',
    });

    const deletedResources = deleteResponse.deleted;

    for ( const [key, value] of Object.entries( deletedResources ) ) {
      if ( value !== 'deleted' ) {
        throw new Error(`Resource ${ key } was not deleted successfully.`);
      }
    }

    return deleteResponse;

  }


  getIdFromSecureURL( secureUrl: string ): string {
    const partsUrl = secureUrl.split("/");

    const imageIdWithExtension = partsUrl[ partsUrl.length - 1 ];

    const partsUrlExtensionYet = imageIdWithExtension.split(".");

    return partsUrlExtensionYet[0];
  }

  
  getIdsFromMultipleSecureURL( secureUrls: string[] ): string[] {

    const imageIds: string[] = [];

    for (const secureUrl of secureUrls) {
  
      const imageId = this.getIdFromSecureURL( secureUrl );
      imageIds.push( imageId );
    }
  
    return imageIds;
  }

  cloudinaryMultipleResponseErrorHandling( responseFromCloudinary: CloudinaryResponse[] ): boolean {

    const hasError = responseFromCloudinary.some( response  => {
      const isApiErrorResponse = response as UploadApiErrorResponse;
      const hasRequiredProperties: boolean = response.message && response.name && response.http_code;
      return isApiErrorResponse && hasRequiredProperties;
    });

    return hasError;
  }

  cloudinarySingleResponseErrorHandling( responseFromCloudinary: CloudinaryResponse ): boolean {

    const isApiErrorResponse = responseFromCloudinary as UploadApiErrorResponse;
    const hasRequiredProperties: boolean = responseFromCloudinary.message && responseFromCloudinary.name && responseFromCloudinary.http_code;
    return isApiErrorResponse && hasRequiredProperties;
    
  }


}