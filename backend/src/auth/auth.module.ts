import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipApplicationEntity } from '../memberApplication/MembershipApplication.Entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([MembershipApplicationEntity]),
    JwtModule.register({
      secret: 'your_jwt_secret',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}