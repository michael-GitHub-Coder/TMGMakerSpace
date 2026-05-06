import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { MembershipApplicationEntity } from 'src/memberApplication/MembershipApplication.Entity';
import bcrypt from 'node_modules/bcryptjs';
import { BookingEmailService } from 'src/bookings/booking-email.service';


@Injectable()
export class MembershipAdminService {
  constructor(
    @InjectRepository(MembershipApplicationEntity)
    private membershipRepo: Repository<MembershipApplicationEntity>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
    private bookingEmailService: BookingEmailService,
  ) {}

  async approve(id: number) {
    const application = await this.membershipRepo.findOne({ where: { id } });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'pending') {
      throw new BadRequestException('Application already processed');
    }

    // Generate one-time password (more reliable format)
    const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log(`[MEMBER_ADMIN] Generated OTP for ${application.email}: ${otp}`);

    // Check if user already exists
    let user = await this.userRepo.findOne({ where: { email: application.email } });
    
    if (user) {
      // Update existing user with new OTP
      user.password = await bcrypt.hash(otp, 10);
      user.role = 'member';
      user.mustChangePassword = true;
      await this.userRepo.save(user);
      console.log(`[MEMBER_ADMIN] Updated existing user: ${application.email}`);
    } else {
      // Create new user
      user = this.userRepo.create({
        firstName: application.name,
        lastName: application.surname,
        email: application.email,
        password: await bcrypt.hash(otp, 10),
        role: 'member',
        mustChangePassword: true,
      });

      await this.userRepo.save(user);
      console.log(`[MEMBER_ADMIN] Created new user: ${application.email}`);
    }

    // Update application
    application.status = 'approved';
    application.oneTimePassword = otp;

    await this.membershipRepo.save(application);

    // Send OTP email to member
    try {
      console.log(`[EMAIL] Attempting to send OTP email to: ${application.email}`);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Welcome to TMG MakerSpace!</h2>
          <p style="color: #666; line-height: 1.6;">Dear ${application.name} ${application.surname},</p>
          <p style="color: #666; line-height: 1.6;">Your membership application has been approved! You can now log in to your account.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Your Login Credentials:</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${application.email}</p>
            <p style="color: #666; margin: 5px 0;"><strong>One-Time Password:</strong> <span style="background-color: #007bff; color: white; padding:5px 10px; border-radius: 4px; font-weight: bold; font-size: 18px;">${otp}</span></p>
          </div>
          <p style="color: #666; line-height: 1.6;">Use this OTP to log in for the first time. You will be required to change your password after logging in.</p>
          <p style="color: #666; line-height: 1.6;">Login here: <a href="http://localhost:4200/login" style="color: #007bff;">TMG MakerSpace Login</a></p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"TMG Makerspace" <Ntokozomokoena07@gmail.com>',
        to: application.email,
        subject: `Your TMG MakerSpace Account - OTP: ${otp}`,
        html: emailHtml,
      };

      console.log(`[EMAIL] Mail options:`, {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const result = await this.bookingEmailService.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] ✅ OTP email sent successfully to: ${application.email}`);
      console.log(`[EMAIL] Message ID: ${result.messageId}`);
      console.log(`[EMAIL] OTP sent: ${otp}`);
      
    } catch (emailError) {
      console.error(`[EMAIL] ❌ Failed to send OTP to ${application.email}:`, emailError);
      console.error(`[EMAIL] Error details:`, {
        code: emailError.code,
        message: emailError.message,
        response: emailError.response
      });
      
      // Don't continue - let admin know email failed
      throw new BadRequestException(`OTP email could not be sent to ${application.email}. Error: ${emailError.message}`);
    }

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



