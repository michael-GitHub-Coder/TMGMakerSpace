import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { MembershipApplicationEntity } from 'src/memberApplication/MembershipApplication.Entity';

@Controller('admin/temp')
export class RemoveMemberController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(MembershipApplicationEntity)
    private readonly membershipRepo: Repository<MembershipApplicationEntity>,
  ) {}

  @Delete('remove-member/:email')
  @HttpCode(HttpStatus.OK)
  async removeMember(@Param('email') email: string) {
    try {
      console.log(`🔍 Looking for member: ${email}`);
      
      // Find and remove membership applications
      const membershipApps = await this.membershipRepo.find({ 
        where: { email: email } 
      });
      
      if (membershipApps.length > 0) {
        console.log(`📋 Found ${membershipApps.length} membership application(s)`);
        await this.membershipRepo.remove(membershipApps);
        console.log(`✅ Removed membership applications`);
      }
      
      // Find and remove user
      const user = await this.userRepo.findOne({ 
        where: { email: email } 
      });
      
      if (user) {
        console.log(`👤 Found user: ${user.firstName} ${user.lastName} (${user.email})`);
        await this.userRepo.remove(user);
        console.log(`✅ Removed user from database`);
        
        return {
          success: true,
          message: `Successfully removed member: ${email}`,
          removedUser: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role
          },
          removedApplications: membershipApps.length
        };
      } else {
        return {
          success: false,
          message: `No user found with email: ${email}`
        };
      }
      
    } catch (error) {
      console.error(`❌ Error removing member:`, error);
      return {
        success: false,
        message: `Error removing member: ${error.message}`
      };
    }
  }
}
