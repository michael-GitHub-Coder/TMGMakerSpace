import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',            
      port: 1433,            
      username: 'TMG_USER',              
      password: 'TMG_USERPASS',    
      database: 'TMGMakerSpace',    
      entities: [User],
      synchronize: true,            
      options: {
        encrypt: false,             
        trustServerCertificate: true, 
      },
    }),
    BookingsModule,
    EmailModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

