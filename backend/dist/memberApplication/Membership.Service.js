"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const MembershipApplication_Entity_1 = require("./MembershipApplication.Entity");
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../users/user.entity");
let MembershipService = class MembershipService {
    membershipRepo;
    userRepo;
    constructor(membershipRepo, userRepo) {
        this.membershipRepo = membershipRepo;
        this.userRepo = userRepo;
    }
    async apply(dto) {
        const newApplication = this.membershipRepo.create({
            ...dto,
            applicationCode: `MEM${Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, '0')}`,
            status: 'pending',
        });
        return this.membershipRepo.save(newApplication);
    }
    findAll() {
        return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException(`Application ${id} not found`);
        return application;
    }
    async adminUpdate(id, dto) {
        const app = await this.findOne(id);
        Object.assign(app, dto);
        if (dto.status === 'approved') {
            app.oneTimePassword = crypto.randomBytes(4).toString('hex');
        }
        return this.membershipRepo.save(app);
    }
    async getAllApplications() {
        return this.membershipRepo.find({ order: { createdAt: 'DESC' } });
    }
    async approveApplication(id) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.status !== 'pending')
            throw new common_1.BadRequestException('Application already processed');
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
    async rejectApplication(id, reason) {
        const application = await this.membershipRepo.findOne({ where: { id } });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        if (application.status !== 'pending')
            throw new common_1.BadRequestException('Application already processed');
        application.status = 'rejected';
        application.rejectionReason = reason;
        return this.membershipRepo.save(application);
    }
    generateRandomPassword(length = 8) {
        return Math.random().toString(36).slice(-length);
    }
};
exports.MembershipService = MembershipService;
exports.MembershipService = MembershipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(MembershipApplication_Entity_1.MembershipApplicationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MembershipService);
//# sourceMappingURL=Membership.Service.js.map