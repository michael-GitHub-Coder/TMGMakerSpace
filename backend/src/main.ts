import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { SerializationInterceptor } from './interceptors/serialization.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Ensure upload directories exist at startup
  ['uploads/marketplace', 'images', 'marketplace'].forEach(dir => {
    const fullPath = join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });

  // Skip body parsing for multipart — let Multer handle it
  (app as any).use((req: any, res: any, next: any) => {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      return next();
    }
    express.json({ limit: '50mb' })(req, res, (err) => {
      if (err) return next(err);
      express.urlencoded({ limit: '50mb', extended: true })(req, res, next);
    });
  });

  // CORS — explicitly allow Angular dev server
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Serve static files
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use('/marketplace', express.static(join(process.cwd(), 'marketplace')));
  app.use('/images', express.static(join(process.cwd(), 'images')));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SerializationInterceptor());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Static files served from: ${join(process.cwd(), 'uploads')}`);
}
bootstrap();