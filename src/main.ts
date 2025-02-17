import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // Allow Angular frontend
    credentials: true, // Allow cookies if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });


  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentation de l’API NestJS')
    .setVersion('1.0')
    .addBearerAuth() // Ajoute l'authentification par token si nécessaire
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
}
bootstrap();
