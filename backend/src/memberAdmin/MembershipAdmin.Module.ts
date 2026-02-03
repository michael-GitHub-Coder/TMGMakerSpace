import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipAdminController } from './MembershipAdminController';
import { MembershipAdminService } from './MembershipAdminService';
import { MembershipApplicationEntity } from 'src/memberApplication/MembershipApplication.Entity';
import { User } from 'src/users/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([MembershipApplicationEntity,User,])],
  providers: [MembershipAdminService],
  controllers: [MembershipAdminController],
})
export class MembershipAdminModule {}
