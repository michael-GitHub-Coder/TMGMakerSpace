import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './MembershipApplication.Entity';
import { CreateMembershipDto, UpdateMembershipDto } from './DTO/membership.dto';
import * as crypto from 'crypto';
import { User } from 'src/users/user.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipApplicationEntity)
    private readonly membershipRepo: Repository<MembershipApplicationEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

//   async apply(dto: CreateMembershipDto): Promise<MembershipApplicationEntity> {
//     const newApplication = this.membershipRepo.create({
//       ...dto,
//       id: `MEM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
//       status: 'pending',
//     });
//     return this.membershipRepo.save(newApplication);
//   }
async apply(dto: CreateMembershipDto): Promise<MembershipApplicationEntity> {
  const newApplication = this.membershipRepo.create({
    ...dto,
    applicationCode: `MEM${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`,
    status: 'pending',
  });

  return this.membershipRepo.save(newApplication);
}

  findAll(): Promise<MembershipApplicationEntity[]> {
    return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<MembershipApplicationEntity> {
    const application = await this.membershipRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException(`Application ${id} not found`);
    return application;
  }

  async adminUpdate(id: number, dto: UpdateMembershipDto): Promise<MembershipApplicationEntity> {
    const app = await this.findOne(id);
    Object.assign(app, dto);

    // If approved, generate one-time password
    if (dto.status === 'approved') {
      app.oneTimePassword = crypto.randomBytes(4).toString('hex'); // simple 8-char password
    }

    return this.membershipRepo.save(app);
  }



  async getAllApplications(): Promise<MembershipApplicationEntity[]> {
    return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
  }

  async approveApplication(id: number): Promise<MembershipApplicationEntity> {
    const application = await this.membershipRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== 'pending') 
      throw new BadRequestException('Application already processed');

 
    const user = this.userRepo.create({
      firstName: application.name,
      lastName: application.surname,
      email: application.email,
      role: 'member',
      password: this.generateRandomPassword(), 
    });

    await this.userRepo.save(user);

    application.status = 'approved';
    return this.membershipRepo.save(application);
  }

  async rejectApplication(id: number, reason: string) {
    const application = await this.membershipRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== 'pending') 
      throw new BadRequestException('Application already processed');

    application.status = 'rejected';
    application.rejectionReason = reason;
    return this.membershipRepo.save(application);
  }

  private generateRandomPassword(length = 8): string {
    return Math.random().toString(36).slice(-length);
  }


}
