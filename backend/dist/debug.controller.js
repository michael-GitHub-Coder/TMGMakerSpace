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
exports.DebugController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const MembershipApplication_Entity_1 = require("./memberApplication/MembershipApplication.Entity");
const user_entity_1 = require("./users/user.entity");
let DebugController = class DebugController {
    membershipRepo;
    userRepo;
    constructor(membershipRepo, userRepo) {
        this.membershipRepo = membershipRepo;
        this.userRepo = userRepo;
    }
    async getMemberInfo(email) {
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
                otp: membership.oneTimePassword,
            } : null,
            user: user ? {
                role: user.role,
                hasPassword: !!user.password,
                mustChangePassword: user.mustChangePassword,
            } : null,
        };
    }
};
exports.DebugController = DebugController;
__decorate([
    (0, common_1.Get)('member-info'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "getMemberInfo", null);
exports.DebugController = DebugController = __decorate([
    (0, common_1.Controller)('debug'),
    __param(0, (0, typeorm_1.InjectRepository)(MembershipApplication_Entity_1.MembershipApplicationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DebugController);
//# sourceMappingURL=debug.controller.js.map