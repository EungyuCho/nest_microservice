import { IsString } from 'class-validator';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Product } from '../entities/product.entity';

export class CreateProductOutput extends CoreOutput {
  product?: Product;
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  image: string;
}
