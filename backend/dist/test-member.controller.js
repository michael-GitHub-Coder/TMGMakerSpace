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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMemberController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const MembershipApplication_Entity_1 = require("./memberApplication/MembershipApplication.Entity");
const user_entity_1 = require("./users/user.entity");
const auth_service_1 = require("./auth/auth.service");
let TestMemberController = class TestMemberController {
    membershipRepo;
    userRepo;
    authService;
    constructor(membershipRepo, userRepo, authService) {
        this.membershipRepo = membershipRepo;
        this.userRepo = userRepo;
        this.authService = authService;
    }
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
    async testLogin(loginData) {
        const result = await this.authService.validateUser(loginData.email, loginData.password);
        return {
            success: !!result,
            user: result,
            message: result ? 'Login successful' : 'Login failed'
        };
    }
    async getMemberDetails(email) {
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
};
exports.TestMemberController = TestMemberController;
__decorate([
    (0, common_1.Get)('check-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestMemberController.prototype, "checkAllMembers", null);
__decorate([
    (0, common_1.Post)('test-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestMemberController.prototype, "testLogin", null);
__decorate([
    (0, common_1.Get)('member-details'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestMemberController.prototype, "getMemberDetails", null);
exports.TestMemberController = TestMemberController = __decorate([
    (0, common_1.Controller)('test-member'),
    __param(0, (0, typeorm_1.InjectRepository)(MembershipApplication_Entity_1.MembershipApplicationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService])
], TestMemberController);
//# sourceMappingURL=test-member.controller.js.map