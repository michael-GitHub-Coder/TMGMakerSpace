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
let MembershipAdminService = class MembershipAdminService {
    membershipRepo;
    userRepo;
    constructor(membershipRepo, userRepo) {
        this.membershipRepo = membershipRepo;
        this.userRepo = userRepo;
    }
    async approve(id) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (application.status !== 'pending') {
            throw new common_1.BadRequestException('Application already processed');
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let otp = '';
        for (let i = 0; i < 8; i++) {
            otp += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log(`[MEMBER_ADMIN] Generated OTP: ${otp} for email: ${application.email}`);
        const user = this.userRepo.create({
            firstName: application.name,
            lastName: application.surname,
            email: application.email,
            password: await bcryptjs_1.default.hash(otp, 10),
            role: 'member',
            mustChangePassword: true,
        });
        await this.userRepo.save(user);
        application.status = 'approved';
        application.oneTimePassword = otp;
        await this.membershipRepo.save(application);
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
        typeorm_2.Repository])
], MembershipAdminService);
//# sourceMappingURL=MembershipAdminService.js.map