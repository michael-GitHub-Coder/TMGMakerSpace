import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipAdminController } from './MembershipAdminController';
import { MembershipAdminService } from './MembershipAdminService';
import { RemoveMemberController } from './remove-member.controller';
import { MembershipApplicationEntity } from 'src/memberApplication/MembershipApplication.Entity';
import { User } from 'src/users/user.entity';
import { BookingEmailService } from 'src/bookings/booking-email.service';
import { BookingsModule } from 'src/bookings/bookings.module';


@Module({
  imports: [TypeOrmModule.forFeature([MembershipApplicationEntity,User,]), BookingsModule],
  providers: [MembershipAdminService, BookingEmailService],
  controllers: [MembershipAdminController, RemoveMemberController],
})
export class MembershipAdminModule {}
