import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //class-validation (dto에서 IsString처럼 정해줄때)을 할때 pipeline을 지정해주어야 작동된다.
  app.useGlobalPipes(new ValidationPipe());
  //app.module말고 main.ts에서도 함수로 정의한 jwtmiddleware를 사용할 수도 있다. class 일때는 안된다.
  await app.listen(8080);
}
bootstrap();
