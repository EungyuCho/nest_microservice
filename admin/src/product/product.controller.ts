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
import {
  CreateProductDto,
  CreateProductOutput,
} from './dtos/create-product.dto';
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
    return this.productService.allProducts();
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreateProductOutput> {
    const createProductOutput = await this.productService.createProduct(
      createProductDto,
    );
    this.client.emit('product_created', createProductOutput.product);
    return createProductOutput;
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
    const updateProductOutput = await this.productService.putProduct(
      id,
      putProductDto,
    );
    const product = await this.productService.getProduct(id);
    this.client.emit('product_updated', product.product);
    return updateProductOutput;
  }

  @Patch('/:id')
  async patchProduct(
    @Param('id') id: number,
    @Body() patchProductDto: PatchProductDto,
  ): Promise<GetProductOutput> {
    const updateProductOutput = this.productService.patchProduct(
      id,
      patchProductDto,
    );
    const product = await this.productService.getProduct(id);
    this.client.emit('product_updated', product.product);
    return updateProductOutput;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number): Promise<CoreOutput> {
    const deleteProductOutput = await this.productService.deleteProduct(id);
    this.client.emit('product_deleted', id);
    return deleteProductOutput;
  }

  @Post(':id/like')
  async like(@Param('id') id: number): Promise<CoreOutput> {
    return this.productService.increaseLikes(id);
  }
}
