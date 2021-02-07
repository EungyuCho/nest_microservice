import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AllProductsOutput } from './dtos/all-products.dto';
import { CoreOutput } from '../common/dtos/output.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductOutput } from './dtos/get-podcast.dto';
import { PatchProductDto } from './dtos/patch-product.dto';
import { PutProductDto } from './dtos/put-product.dto';
import { PRODUCT_SERVICE } from '../constant';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(PRODUCT_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Get()
  async allProducts(): Promise<AllProductsOutput> {
    this.client.emit('hello', 'hello from RabbitMQ!');
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

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number): Promise<CoreOutput> {
    return this.productService.deleteProduct(id);
  }
}
