import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { AllProductsOutput } from './dtos/all-products.dto';
import { CoreOutput } from '../common/dtos/output.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductOutput } from './dtos/get-podcast.dto';
import { PatchProductDto } from './dtos/patch-product.dto';
import { PutProductDto } from './dtos/put-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async allProducts(): Promise<AllProductsOutput> {
    return this.productService.allProducts();
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CoreOutput> {
    return this.productService.createProduct(createProductDto);
  }

  @Get('/:id')
  async getProduct(@Param('id') id: number): Promise<GetProductOutput> {
    return this.productService.getProduct(id);
  }

  @Put('/:id')
  async putProduct(
    @Param('id') id: number,
    @Body() putProductDto: PutProductDto,
  ): Promise<CoreOutput> {
    return this.productService.putProduct(id, putProductDto);
  }

  @Patch('/:id')
  async patchProduct(
    @Param('id') id: number,
    @Body() patchProductDto: PatchProductDto,
  ): Promise<GetProductOutput> {
    return this.productService.patchProduct(id, patchProductDto);
  }
}
