import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipService } from './Membership.Service';
import { MembershipController } from './MembershipController';
import { MembershipApplicationEntity } from './MembershipApplication.Entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipApplicationEntity,User,])],
  providers: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
