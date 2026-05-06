
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { SerializationInterceptor } from './interceptors/serialization.interceptor';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:51581', 'http://localhost:62378'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Increase payload size limits for image uploads
  // Note: Don't apply JSON middleware globally as it conflicts with FormData
  // app.use(express.json({ limit: '10mb' }));
  
  // Apply URL-encoded middleware with exception for multipart routes
  app.use((req, res, next) => {
    if (req.path === '/memberships/apply' && req.method === 'POST') {
      // Skip body parsing for membership application
      return next();
    }
    return express.urlencoded({ limit: '10mb', extended: true })(req, res, next);
  });
  
  // Serve static files from uploads directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  // Serve static files from marketplace directory
  app.use('/marketplace', express.static(join(__dirname, '..', 'marketplace')));
  
  // Serve static files from images directory
  app.use('/images', express.static(join(__dirname, '..', 'images')));
  
  // Disable global validation to prevent FormData conflicts
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   transform: true,
  //   forbidNonWhitelisted: false,
  //   transformOptions: {
  //     enableImplicitConversion: true,
  //   },
  // }));
  
  // Apply global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Apply global serialization interceptor
  app.useGlobalInterceptors(new SerializationInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('Backend server running on http://localhost:3000');
}
bootstrap();
