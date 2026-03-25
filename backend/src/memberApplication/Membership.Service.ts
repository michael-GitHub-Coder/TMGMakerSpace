// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { MembershipApplicationEntity } from './MembershipApplication.Entity';
// import { CreateMembershipDto, UpdateMembershipDto } from './DTO/membership.dto';
// import * as crypto from 'crypto';
// import { User } from 'src/users/user.entity';

// @Injectable()
// export class MembershipService {
//   constructor(
//     @InjectRepository(MembershipApplicationEntity)
//     private readonly membershipRepo: Repository<MembershipApplicationEntity>,
//     @InjectRepository(User)
//     private readonly userRepo: Repository<User>,
//   ) {}

// //   async apply(dto: CreateMembershipDto): Promise<MembershipApplicationEntity> {
// //     const newApplication = this.membershipRepo.create({
// //       ...dto,
// //       id: `MEM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
// //       status: 'pending',
// //     });
// //     return this.membershipRepo.save(newApplication);
// //   }
// async apply(dto: CreateMembershipDto): Promise<MembershipApplicationEntity> {
//   const newApplication = this.membershipRepo.create({
//     ...dto,
//     applicationCode: `MEM${Math.floor(Math.random() * 10000)
//       .toString()
//       .padStart(4, '0')}`,
//     status: 'pending',
//   });

//   return this.membershipRepo.save(newApplication);
// }

//   findAll(): Promise<MembershipApplicationEntity[]> {
//     return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
//   }

//   async findOne(id: number): Promise<MembershipApplicationEntity> {
//     const application = await this.membershipRepo.findOne({ where: { id } });
//     if (!application) throw new NotFoundException(`Application ${id} not found`);
//     return application;
//   }

//   async adminUpdate(id: number, dto: UpdateMembershipDto): Promise<MembershipApplicationEntity> {
//     const app = await this.findOne(id);
//     Object.assign(app, dto);

//     // If approved, generate one-time password
//     if (dto.status === 'approved') {
//       app.oneTimePassword = crypto.randomBytes(4).toString('hex'); // simple 8-char password
//     }

//     return this.membershipRepo.save(app);
//   }



//   async getAllApplications(): Promise<MembershipApplicationEntity[]> {
//     return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
//   }

//   async approveApplication(id: number): Promise<MembershipApplicationEntity> {
//     const application = await this.membershipRepo.findOne({ where: { id } });
//     if (!application) throw new NotFoundException('Application not found');
//     if (application.status !== 'pending') 
//       throw new BadRequestException('Application already processed');

 
//     const user = this.userRepo.create({
//       firstName: application.name,
//       lastName: application.surname,
//       email: application.email,
//       role: 'member',
//       password: this.generateRandomPassword(), 
//     });

//     await this.userRepo.save(user);

//     application.status = 'approved';
//     return this.membershipRepo.save(application);
//   }

//   async rejectApplication(id: number, reason: string) {
//     const application = await this.membershipRepo.findOne({ where: { id } });
//     if (!application) throw new NotFoundException('Application not found');
//     if (application.status !== 'pending') 
//       throw new BadRequestException('Application already processed');

//     application.status = 'rejected';
//     application.rejectionReason = reason;
//     return this.membershipRepo.save(application);
//   }

//   private generateRandomPassword(length = 8): string {
//     return Math.random().toString(36).slice(-length);
//   }


// }

import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './MembershipApplication.Entity';
import { CreateMembershipDto, UpdateMembershipDto } from './DTO/membership.dto';
import * as crypto from 'crypto';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipApplicationEntity)
    private readonly membershipRepo: Repository<MembershipApplicationEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

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
      app.oneTimePassword = crypto.randomBytes(4).toString('hex');
    }

    return this.membershipRepo.save(app);
  }

  async getAllApplications(): Promise<MembershipApplicationEntity[]> {
    return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
  }

//   async approveApplication(id: number): Promise<MembershipApplicationEntity> {
//     const application = await this.membershipRepo.findOne({ where: { id } });
//     if (!application) throw new NotFoundException('Application not found');
//     if (application.status !== 'pending') 
//       throw new BadRequestException('Application already processed');

//     // ⭐ NEW: Check if user with this email already exists
//     const existingUser = await this.userRepo.findOne({ 
//       where: { email: application.email } 
//     });

//     if (existingUser) {
//       // User already exists - just update application status
//       console.log(`User with email ${application.email} already exists, skipping user creation`);
//       application.status = 'approved';
//       application.oneTimePassword = crypto.randomBytes(4).toString('hex');
//       return this.membershipRepo.save(application);
//     }

//     // Create user account only if user doesn't exist
//     // const user = this.userRepo.create({
//     //   firstName: application.name,
//     //   lastName: application.surname,
//     //   email: application.email,
//     //   role: 'member',
//     //   password: this.generateRandomPassword(),
//     // });

//     // user.password = await bcrypt.hash(user.password, 10);
//     // user.mustChangePassword = false;
    
//     const plainPassword = this.generateRandomPassword();
//     console.log("Generated password:", plainPassword);

//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     const user = this.userRepo.create({
//       firstName: application.name,
//       lastName: application.surname,
//       email: application.email,
//       role: 'member',
//       password: hashedPassword,
//     });

//     console.log(`Creating user for email ${application.email} with name ${application.name} ${application.surname}`); 
//     console.log('User entity before save:', user);

//     await this.userRepo.save(user);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "motlokwa.thulare@gmail.com",
//         pass: "fxpdctntknhjtdjp",
//       },
//     });
// // fxpd ctnt knhj tdjp
//     await transporter.sendMail({
//         from: `"Tshimoverse" <$"motlokwa.thulare@gmail.com">`,
//         to: application.email,
//         subject: "You're invited!",
//         html: `<p>You’ve been invited to join Tshimoverse. Click below: (link not active yet)</p>
//                `,
//     });

//     // Update application status
//     application.status = 'approved';
//     application.oneTimePassword = crypto.randomBytes(4).toString('hex');
//     return this.membershipRepo.save(application);
//   }

  async approveApplication(id: number): Promise<MembershipApplicationEntity> {
    const application = await this.membershipRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== 'pending') 
      throw new BadRequestException('Application already processed');

 
    const existingUser = await this.userRepo.findOne({ where: { email: application.email } });
    if (existingUser) {
      console.log(`User with email ${application.email} already exists, skipping user creation`);
      application.status = 'approved';
      application.oneTimePassword = crypto.randomBytes(4).toString('hex');
      return this.membershipRepo.save(application);
    }


    const plainPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    
    const user = this.userRepo.create({
      firstName: application.name,
      lastName: application.surname,
      email: application.email,
      role: 'member',
      password: hashedPassword,
    });
    await this.userRepo.save(user);


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "motlokwa.thulare@gmail.com", 
        pass: "fxpdctntknhjtdjp",       
      },
    });

    // await transporter.sendMail({
    //   from: `"TMGMakerSpace" <motlokwa.thulare@gmail.com>`, 
    //   to: application.email,
    //   subject: "You're invited to Tshimoverse!",
    //   html: `
    //     <p>Hello ${application.name},</p>
    //     <p>You’ve been invited to join Tshimoverse.</p>
    //     <p>Your login credentials are:</p>
    //     <ul>
    //       <li>Email: ${application.email}</li>
    //       <li>Password: ${plainPassword}</li>
    //     </ul>
    //     <p>Please login and change your password.</p>
    //   `,
    // });

    await transporter.sendMail({
        from: `"TMG" <motlokwa.thulare@gmail.com>`, 
        to: application.email,
        subject: "Welcome to Tshimoverse!",
        html: `
          <p>Hello ${application.name},</p>
          <p>Congratulations! You’ve officially become a member of <strong>TMG</strong>. We’re thrilled to have you on board!</p>
          <p>Here are your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${application.email}</li>
            <li><strong>Password:</strong> ${plainPassword}</li>
          </ul>
          <p>Please log in and change your password to keep your account secure.</p>
          <p>Welcome to the community, and we can’t wait to see you get involved!</p>
          <p>Best regards,<br/><strong>TMG Team</strong></p>
        `,
      });
 
    application.status = 'approved';
    application.oneTimePassword = crypto.randomBytes(4).toString('hex');
    return this.membershipRepo.save(application);
  }
  
  async rejectApplication(id: number, reason?: string): Promise<MembershipApplicationEntity> {
    const application = await this.membershipRepo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== 'pending') 
      throw new BadRequestException('Application already processed');

    application.status = 'rejected';
    application.rejectionReason = reason || 'No reason provided';
    return this.membershipRepo.save(application);
  }

  private generateRandomPassword(length = 8): string {
    return Math.random().toString(36).slice(-length);
  }
}