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
exports.MembershipController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const Membership_Service_1 = require("./Membership.Service");
const membership_dto_1 = require("./DTO/membership.dto");
const path_1 = require("path");
let MembershipController = class MembershipController {
    membershipService;
    constructor(membershipService) {
        this.membershipService = membershipService;
    }
    async apply(files, body) {
        const filePaths = files.map(file => file.path);
        const dto = {
            ...body,
            documents: filePaths,
        };
        return this.membershipService.apply(dto);
    }
    getAllApplications() {
        return this.membershipService.getAllApplications();
    }
    approveApplication(id) {
        return this.membershipService.approveApplication(id);
    }
    rejectApplication(id, reason) {
        return this.membershipService.rejectApplication(id, reason);
    }
    findAll() {
        return this.membershipService.findAll();
    }
    findOne(id) {
        return this.membershipService.findOne(id);
    }
    adminUpdate(id, dto) {
        return this.membershipService.adminUpdate(id, dto);
    }
};
exports.MembershipController = MembershipController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], MembershipController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('applications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "getAllApplications", null);
__decorate([
    (0, common_1.Post)('applications/:id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "approveApplication", null);
__decorate([
    (0, common_1.Post)('applications/:id/reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "rejectApplication", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, membership_dto_1.UpdateMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "adminUpdate", null);
exports.MembershipController = MembershipController = __decorate([
    (0, common_1.Controller)('memberships'),
    __metadata("design:paramtypes", [Membership_Service_1.MembershipService])
], MembershipController);
//# sourceMappingURL=MembershipController.js.map