import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipModule } from './memberApplication/Membership.Module';
import { MembershipAdminModule } from './memberAdmin/MembershipAdmin.Module';
import { KeysModule } from './keys/keys.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Ntokz@084',
      database: 'TMGMakerSpace',

      autoLoadEntities: true,
      synchronize: true, // ❗ turn OFF in production
      ssl: false, // PostgreSQL does NOT use encrypt/trustServerCertificate
    }),
    BookingsModule,
    EmailModule,
    AuthModule,
    UsersModule,
    MembershipModule,
    MembershipAdminModule,
    KeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
