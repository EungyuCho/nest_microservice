import { HttpModule, Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      validationSchema: Joi.object({
        DB_HOST: Joi.string()
          .valid()
          .required(),
        DB_PORT: Joi.string()
          .valid()
          .required(),
        DB_USERNAME: Joi.string()
          .valid()
          .required(),
        DB_PASSWORD: Joi.string()
          .valid()
          .required(),
        DB_NAME: Joi.string()
          .valid()
          .required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: true,
      entities: [Product],
      synchronize: process.env.NODE_ENV !== 'prod',
    }),
    ProductModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
