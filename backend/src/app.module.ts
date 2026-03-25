import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { BookingEntity } from './models/Booking.model';
import { MembershipModule } from './memberApplication/Membership.Module';
import { MembershipAdminModule } from './memberAdmin/MembershipAdmin.Module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config.env', 
    }),

    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',            
      port: 1433,            
      username: 'TMG_USER',              
      password: 'TMG_USERPASS',    
      database: 'TMGMakerSpace',    
      autoLoadEntities: true,
      // entities: [User,BookingEntity],
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
    MembershipModule,
    MembershipAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

