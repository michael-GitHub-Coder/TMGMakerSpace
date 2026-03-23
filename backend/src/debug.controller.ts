import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './memberApplication/MembershipApplication.Entity';
import { User } from './users/user.entity';

@Controller('debug')
export class DebugController {
  constructor(
    @InjectRepository(MembershipApplicationEntity)
    private readonly membershipRepo: Repository<MembershipApplicationEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  @Get('member-info')
  async getMemberInfo(@Query('email') email: string) {
    const membership = await this.membershipRepo.findOne({
      where: { email },
    });

    const user = await this.userRepo.findOne({
      where: { email },
    });

    return {
      email,
      membership: membership ? {
        status: membership.status,
        hasOTP: !!membership.oneTimePassword,
        otp: membership.oneTimePassword, // Only for debugging!
      } : null,
      user: user ? {
        role: user.role,
        hasPassword: !!user.password,
        mustChangePassword: user.mustChangePassword,
      } : null,
    };
  }
}
