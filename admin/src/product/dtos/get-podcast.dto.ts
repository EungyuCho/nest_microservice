import { CoreOutput } from '../../common/dtos/output.dto';
import { Product } from '../entities/product.entity';

export class GetProductOutput extends CoreOutput {
  product?: Product;
}
