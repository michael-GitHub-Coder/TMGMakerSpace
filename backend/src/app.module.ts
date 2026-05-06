import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipModule } from './memberApplication/Membership.Module';
import { MembershipAdminModule } from './memberAdmin/MembershipAdmin.Module';
import { KeysModule } from './keys/keys.module';
import { DebugController } from './debug.controller';
import { TestController } from './test.controller';
import { TestMemberController } from './test-member.controller';
import { EmailTestController } from './email-test.controller';
import { BookingEmailService } from './bookings/booking-email.service';
import { KeyNotificationService } from './keys/key-notification.service';
import { MembershipApplicationEntity } from './memberApplication/MembershipApplication.Entity';
import { User } from './users/user.entity';
import { BlogsModule } from './blogs/blogs.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { MarketplaceItem } from './marketplace/entities/marketplace-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available throughout the application
      envFilePath: ['../.env', 'config.env'], // Try both .env files
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([MembershipApplicationEntity, User, MarketplaceItem]),
    BookingsModule,
    EmailModule,
    AuthModule,
    UsersModule,
    MembershipModule,
    MembershipAdminModule,
    KeysModule,
    BlogsModule,
    MarketplaceModule,
  ],
  controllers: [AppController, DebugController, TestController, TestMemberController, EmailTestController],
  providers: [AppService, BookingEmailService, KeyNotificationService],
  exports: [TypeOrmModule],
})
export class AppModule {}
