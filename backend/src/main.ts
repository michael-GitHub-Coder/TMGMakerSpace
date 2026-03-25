// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   // Enable CORS for frontend
//   app.enableCors({
//     origin: ['http://localhost:4200', 'http://localhost:51581', 'http://localhost:62378'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });
  
//   // Enable validation
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     transform: true,
//   }));
  
//   await app.listen(process.env.PORT ?? 3000);
//   console.log('Backend server running on http://localhost:3000');
// }
// bootstrap();

import * as dotenv from 'dotenv';
import { join } from 'path';

// 👇 THIS MUST BE FIRST
dotenv.config({ path: join(__dirname, './config.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

async function bootstrap() {
  // Change this line to use NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:51581', 'http://localhost:62378'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // ⭐ NEW: Serve static files from uploads directory
  const uploadsPath = join(__dirname, '..', 'uploads');
  // console.log(' Serving static files from:', uploadsPath);
  
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(' Backend server running on http://localhost:3000');
  // console.log(' Documents accessible at http://localhost:3000/uploads/[filename]');
}
bootstrap();