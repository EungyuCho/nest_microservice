import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { AllProductsOutput } from './dtos/all-products.dto';
import {
  CreateProductDto,
  CreateProductOutput,
} from './dtos/create-product.dto';
import { CoreOutput } from '../common/dtos/output.dto';
import { GetProductOutput } from './dtos/get-podcast.dto';
import { PutProductDto } from './dtos/put-product.dto';
import { PatchProductDto } from './dtos/patch-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}
  async allProducts(): Promise<AllProductsOutput> {
    try {
      const products = await this.products.find();
      return {
        ok: true,
        products,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load Products',
      };
    }
  }

  async createProduct({
    title,
    image,
  }: CreateProductDto): Promise<CreateProductOutput> {
    try {
      const exist = await this.products.findOne({ title });

      if (exist) {
        return {
          ok: false,
          error: 'There is same product with title already',
        };
      }

      const product = this.products.create({ title, image });
      await this.products.save(product);

      return {
        ok: true,
        product: product,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create Product',
      };
    }
  }

  async getProduct(id: number): Promise<GetProductOutput> {
    try {
      const product = await this.products.findOne({ id });
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }
      return {
        ok: true,
        product,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load Product',
      };
    }
  }
  async putProduct(
    id: number,
    { title, image }: PutProductDto,
  ): Promise<CoreOutput> {
    try {
      const product = await this.products.findOne({ id });
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }

      product.title = title;
      product.image = image;

      await this.products.save(product);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load Product',
      };
    }
  }

  async patchProduct(
    id: number,
    patchProductDto: PatchProductDto,
  ): Promise<CoreOutput> {
    try {
      const product = await this.products.findOne({ id });
      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }

      if (patchProductDto.title) {
        product.title = patchProductDto.title;
      }

      if (patchProductDto.image) {
        product.image = patchProductDto.image;
      }

      await this.products.save(product);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load Product',
      };
    }
  }

  async deleteProduct(id: number): Promise<CoreOutput> {
    try {
      const product = await this.products.findOne({ id });

      if (!product) {
        return {
          ok: false,
          error: 'Product not found',
        };
      }

      await this.products.delete(id);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete Product',
      };
    }
  }
}
