import { CoreOutput } from '../../common/dtos/output.dto';
import { Product } from '../entities/product.entity';

export class AllProductsOutput extends CoreOutput {
  products?: Product[];
}
