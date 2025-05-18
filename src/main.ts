import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('📚 Book API')
    .setDescription('NestJS CRUD API for Authors and Books')
    .setVersion('1.0.0')
    .addTag('Author') 
    .addTag('Book') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger docs: http://localhost:3000/docs`);
}
bootstrap();
