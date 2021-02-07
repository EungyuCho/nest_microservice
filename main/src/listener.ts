import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://dshgnltx:G_TKzdR0UFoBZ949Hyxum40lByUkmtJx@mustang.rmq.cloudamqp.com/dshgnltx',
      ],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.listen(() => {
    console.log('Main Microservice is listening...');
  });
}
bootstrap();
