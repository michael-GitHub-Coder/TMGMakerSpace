import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './memberApplication/MembershipApplication.Entity';
import { User } from './users/user.entity';
import { AuthService } from './auth/auth.service';

@Controller('test-member')
export class TestMemberController {
  constructor(
    @InjectRepository(MembershipApplicationEntity)
    private readonly membershipRepo: Repository<MembershipApplicationEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  @Get('check-all')
  async checkAllMembers() {
    const allApplications = await this.membershipRepo.find();
    const allUsers = await this.userRepo.find();
    
    return {
      totalApplications: allApplications.length,
      approvedApplications: allApplications.filter(app => app.status === 'approved'),
      totalUsers: allUsers.length,
      memberUsers: allUsers.filter(user => user.role === 'member'),
      allApplications: allApplications.map(app => ({
        email: app.email,
        status: app.status,
        hasOTP: !!app.oneTimePassword,
        otp: app.oneTimePassword,
        name: app.name,
        surname: app.surname
      })),
      allUsers: allUsers.map(user => ({
        email: user.email,
        role: user.role,
        hasPassword: !!user.password,
        mustChangePassword: user.mustChangePassword,
        firstName: user.firstName,
        lastName: user.lastName
      }))
    };
  }

  @Post('test-login')
  async testLogin(@Body() loginData: { email: string; password: string }) {
    const result = await this.authService.validateUser(loginData.email, loginData.password);
    
    return {
      success: !!result,
      user: result,
      message: result ? 'Login successful' : 'Login failed'
    };
  }

  @Get('member-details')
  async getMemberDetails(@Query('email') email: string) {
    const membership = await this.membershipRepo.findOne({
      where: { email }
    });

    const user = await this.userRepo.findOne({
      where: { email }
    });

    return {
      email,
      membership: membership ? {
        status: membership.status,
        hasOTP: !!membership.oneTimePassword,
        otp: membership.oneTimePassword,
        name: membership.name,
        surname: membership.surname
      } : null,
      user: user ? {
        role: user.role,
        hasPassword: !!user.password,
        mustChangePassword: user.mustChangePassword,
        firstName: user.firstName,
        lastName: user.lastName
      } : null
    };
  }
}
