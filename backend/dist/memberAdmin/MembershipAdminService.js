"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipAdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const MembershipApplication_Entity_1 = require("../memberApplication/MembershipApplication.Entity");
const bcryptjs_1 = __importDefault(require("../../node_modules/bcryptjs/umd/index.js"));
const booking_email_service_1 = require("../bookings/booking-email.service");
let MembershipAdminService = class MembershipAdminService {
    membershipRepo;
    userRepo;
    bookingEmailService;
    constructor(membershipRepo, userRepo, bookingEmailService) {
        this.membershipRepo = membershipRepo;
        this.userRepo = userRepo;
        this.bookingEmailService = bookingEmailService;
    }
    async approve(id) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (application.status !== 'pending') {
            throw new common_1.BadRequestException('Application already processed');
        }
        const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
        console.log(`[MEMBER_ADMIN] Generated OTP for ${application.email}: ${otp}`);
        let user = await this.userRepo.findOne({ where: { email: application.email } });
        if (user) {
            user.password = await bcryptjs_1.default.hash(otp, 10);
            user.role = 'member';
            user.mustChangePassword = true;
            await this.userRepo.save(user);
            console.log(`[MEMBER_ADMIN] Updated existing user: ${application.email}`);
        }
        else {
            user = this.userRepo.create({
                firstName: application.name,
                lastName: application.surname,
                email: application.email,
                password: await bcryptjs_1.default.hash(otp, 10),
                role: 'member',
                mustChangePassword: true,
            });
            await this.userRepo.save(user);
            console.log(`[MEMBER_ADMIN] Created new user: ${application.email}`);
        }
        application.status = 'approved';
        application.oneTimePassword = otp;
        await this.membershipRepo.save(application);
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
        }
        catch (emailError) {
            console.error(`[EMAIL] ❌ Failed to send OTP to ${application.email}:`, emailError);
            console.error(`[EMAIL] Error details:`, {
                code: emailError instanceof Error && 'code' in emailError ? emailError.code : undefined,
                message: emailError instanceof Error ? emailError.message : String(emailError),
                response: emailError instanceof Error && 'response' in emailError ? emailError.response : undefined
            });
            throw new common_1.BadRequestException(`OTP email could not be sent to ${application.email}. Error: ${emailError instanceof Error ? emailError.message : String(emailError)}`);
        }
        return {
            message: 'Application approved',
            email: application.email,
            oneTimePassword: otp,
        };
    }
    async reject(id, reason) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        application.status = 'rejected';
        application.rejectionReason = reason;
        return this.membershipRepo.save(application);
    }
    async requestMoreInfo(id, comment) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
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
    async deleteMember(id) {
        const member = await this.userRepo.findOne({ where: { id, role: 'member' } });
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        await this.userRepo.remove(member);
        return { message: `Member with ID ${id} deleted successfully` };
    }
};
exports.MembershipAdminService = MembershipAdminService;
exports.MembershipAdminService = MembershipAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(MembershipApplication_Entity_1.MembershipApplicationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        booking_email_service_1.BookingEmailService])
], MembershipAdminService);
//# sourceMappingURL=MembershipAdminService.js.map