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
exports.KeysController = void 0;
const common_1 = require("@nestjs/common");
const keys_service_1 = require("./keys.service");
let KeysController = class KeysController {
    keysService;
    constructor(keysService) {
        this.keysService = keysService;
    }
    async findAll() {
        return this.keysService.findAll();
    }
    async getStatistics() {
        return this.keysService.getStatistics();
    }
    async findOne(id) {
        const key = await this.keysService.findOne(id);
        if (!key) {
            throw new common_1.HttpException('Key not found', common_1.HttpStatus.NOT_FOUND);
        }
        return key;
    }
    async issueKey(id, issueRequest) {
        try {
            return await this.keysService.issueKey(id, issueRequest);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async returnKey(id, returnedBy) {
        try {
            return await this.keysService.returnKey(id, returnedBy);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getKeysByStatus(status) {
        return this.keysService.getKeysByStatus(status);
    }
    async getKeysByEquipment(equipmentName) {
        return this.keysService.getKeysByEquipment(equipmentName);
    }
    async getKeysByMember(memberName) {
        return this.keysService.getKeysByMember(memberName);
    }
    async createKey(keyData) {
        try {
            return await this.keysService.create(keyData);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.KeysController = KeysController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/issue'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "issueKey", null);
__decorate([
    (0, common_1.Post)(':id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('returnedBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "returnKey", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "getKeysByStatus", null);
__decorate([
    (0, common_1.Get)('equipment/:equipmentName'),
    __param(0, (0, common_1.Param)('equipmentName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "getKeysByEquipment", null);
__decorate([
    (0, common_1.Get)('member/:memberName'),
    __param(0, (0, common_1.Param)('memberName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "getKeysByMember", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KeysController.prototype, "createKey", null);
exports.KeysController = KeysController = __decorate([
    (0, common_1.Controller)('keys'),
    __metadata("design:paramtypes", [keys_service_1.KeysService])
], KeysController);
//# sourceMappingURL=keys.controller.js.map