import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest_main', {
      autoCreate: true,
      useFindAndModify: false,
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
