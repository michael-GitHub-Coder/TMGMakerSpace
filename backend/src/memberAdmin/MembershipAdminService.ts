import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { MembershipApplicationEntity } from 'src/memberApplication/MembershipApplication.Entity';
import bcrypt from 'node_modules/bcryptjs';


@Injectable()
export class MembershipAdminService {
  constructor(
    @InjectRepository(MembershipApplicationEntity)
    private membershipRepo: Repository<MembershipApplicationEntity>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async approve(id: number) {
    const application = await this.membershipRepo.findOne({ where: { id } });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'pending') {
      throw new BadRequestException('Application already processed');
    }

    // Generate one-time password
    const otp = Math.random().toString(36).slice(-8);

    // Create user
    const user = this.userRepo.create({
      firstName: application.name,
      lastName: application.surname,
      email: application.email,
      password: await bcrypt.hash(otp, 10),
      role: 'member',
      mustChangePassword: true,
    });

    await this.userRepo.save(user);

    // Update application
    application.status = 'approved';
    application.oneTimePassword = otp;

    await this.membershipRepo.save(application);

    // TODO: send email here
    // email: application.email
    // password: otp

    return {
      message: 'Application approved',
      email: application.email,
      oneTimePassword: otp, 
    };
  }

    async reject(id: number, reason: string) {
            const application = await this.membershipRepo.findOne({ where: { id } });

            if (!application) {
            throw new NotFoundException('Application not found');
            }

            application.status = 'rejected';
            application.rejectionReason = reason;

            return this.membershipRepo.save(application);
    }

    async requestMoreInfo(id: number, comment: string) {
        const application = await this.membershipRepo.findOne({ where: { id } });

        if (!application) {
        throw new NotFoundException('Application not found');
        }

        application.status = 'info-required';
        application.adminComment = comment;
        application.rejectionReason = comment;

        return this.membershipRepo.save(application);
    }

    async getAllMembers() {
    return this.userRepo.find({
      where: { role: 'member' },
      select: ['firstName', 'lastName', 'email'], 
    });
  }

 
  async deleteMember(id: number) {
    const member = await this.userRepo.findOne({ where: { id, role: 'member' } });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.userRepo.remove(member);
    return { message: `Member with ID ${id} deleted successfully` };
  }
}



