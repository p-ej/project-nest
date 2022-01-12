import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as winston from 'winston';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe()); // 등록해야 class validation을 사용할 수 있음.

  // 스웨거 보안
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    })
  );

  // localhost:8000/media/cats/aaa.png
  // 스태틱 파일 제공 익스프레스 애플리케이션이라고 명시를 해주어야 한다. 
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media',
  })

  // api 독스 부분
  const config = new DocumentBuilder()
    .setTitle('C.I.C')
    .setDescription('cat')
    .setVersion('1.0.0')
    // .addTag('cats')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // docs : 스웨거 api의 엔드포인트 지정
  app.enableCors({
    origin: true,
    credentials: true
  });
  const PORT = process.env.PORT
  await app.listen(PORT);
}
bootstrap();
