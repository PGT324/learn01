import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //class-validation (dto에서 IsString처럼 정해줄때)을 할때 pipeline을 지정해주어야 작동된다.
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8080);
}
bootstrap();
