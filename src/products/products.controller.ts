import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductImagesService } from './product-images.service';
import { User } from 'src/auth/entities';
import { GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common/dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeleteFileDto, DeleteFilesDto, UpdateOptionsDto, CreateProductDto, UpdateProductDto, SupplierQueryDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';

// localhost:3000/api/products
@Controller('products')
@UseGuards( JwtAuthGuard )
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,

    private readonly productImagesService: ProductImagesService, 
  ) {}

  //*NO usar para graficar
  @Post('create') // localhost:3000/api/products/create - POST
  @UseInterceptors( FilesInterceptor('file[]', 6) )
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
    @Query() supplierQueryDto: SupplierQueryDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4 megabytes
          new FileTypeValidator({ fileType: '.(jpg|png|jpeg)' }), // extensions
        ]
      }),
    ) files: Express.Multer.File[],
  ) {
    return this.productsService.createProduct( createProductDto, user, supplierQueryDto, files );
  }

  //*SI usar para graficar
  @Get('find') // localhost:3000/api/products/find - GET
  findAllProducts(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.productsService.findAllProducts( paginationDto, user );
  }

  //*SI usar para graficar
  @Get('find/:id') // localhost:3000/api/products/find/:id - GET
  findProductByTerm(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.productsService.findProductByTerm( id );
  }

  //*NO usar para graficar
  @Patch(':id') // localhost:3000/api/products/:id - PATCH
  @UseInterceptors( FilesInterceptor('file[]', 6) )
  updateProduct(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Query() updateOptionsDto: UpdateOptionsDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4 megabytes
          new FileTypeValidator({ fileType: '.(jpg|png|jpeg)' }), // extensions
        ]
      }),
    ) files: Express.Multer.File[],
  ) {
    return this.productsService.updateProduct( id, updateProductDto, files, updateOptionsDto );
  }

  @Delete(':id') // localhost:3000/api/products/:id - DELETE
  deleteProduct(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.productsService.deleteProduct( id );
  }

  @Delete('files/delete-file') // localhost:3000/api/products/files/delete-file - DELETE
  deleteSingleImageBySecureURL(
    @Body() deleteFileDto: DeleteFileDto
  ) {
    return this.productImagesService.deleteSingleImage( deleteFileDto );
  }

  @Delete('files/delete-files') // localhost:3000/api/products/files/delete-files - DELETE
  deleteMultipleImagesBySecureURLs(
    @Body() deleteFilesDto: DeleteFilesDto
  ) {
    return this.productImagesService.deleteMultipleImages( deleteFilesDto );
  }

  @Get('files/by-id/:id') // localhost:3000/api/products/files/by-id/:id - GET
  findImageById(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.productImagesService.findImageBySecureUrl( id );
  }

  @Get('files/all/:id') // localhost:3000/api/products/files/all/:id - GET
  findAllImagesOfProduct(
    @Param('id', ParseUUIDPipe ) id: string, //idProduct
    @Query() paginationDto: PaginationDto
  ) {
    return this.productImagesService.findAllImages( id, paginationDto );
  }

}


  // @Post('file/:id')  // localhost:3000/api/products/file/:id - POST
  // @UseInterceptors( FileInterceptor('file') )
  // uploadSingleProductImage( 
  //   @Param('id', ParseUUIDPipe ) id: string,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4 megabytes
  //         new FileTypeValidator({ fileType: '.(jpg|png|jpeg)' }), // extensions
  //       ]
  //     }),
  //   ) file: Express.Multer.File,   
  // ) {
  //   return this.productImagesService.createProductWithSingleImage( id, file );
  // } 

  // @Post('files/:id')  // localhost:3000/api/products/files/:id - POST
  // @UseInterceptors( FilesInterceptor('file[]', 5) ) //hasta 5 archivos
  // uploadMultipleProductImages( 
  //   @Param('id', ParseUUIDPipe ) id: string,
  //   @UploadedFiles(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4 megabytes
  //         new FileTypeValidator({ fileType: '.(jpg|png|jpeg)' }), // extensions
  //       ]
  //     }),
  //   ) files: Express.Multer.File[],   
  // ) {
  //   return this.productImagesService.createProductWithMultipleImages( id, files );
  // } 
