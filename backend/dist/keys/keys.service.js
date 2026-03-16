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
exports.KeysService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const key_entity_1 = require("./key.entity");
let KeysService = class KeysService {
    keyRepository;
    constructor(keyRepository) {
        this.keyRepository = keyRepository;
    }
    async findAll() {
        return this.keyRepository.find({
            order: {
                equipmentName: 'ASC'
            }
        });
    }
    async findOne(id) {
        const key = await this.keyRepository.findOne({ where: { id } });
        return key || null;
    }
    async create(keyData) {
        const newKey = this.keyRepository.create(keyData);
        return this.keyRepository.save(newKey);
    }
    async update(id, updateData) {
        await this.keyRepository.update(id, updateData);
        const updatedKey = await this.findOne(id);
        if (!updatedKey) {
            throw new Error('Key not found after update');
        }
        return updatedKey;
    }
    async issueKey(id, issueRequest) {
        const key = await this.findOne(id);
        if (!key) {
            throw new Error('Key not found');
        }
        if (key.keyStatus !== 'available') {
            throw new Error('Key is already issued or returned');
        }
        const updateData = {
            keyStatus: 'issued',
            memberName: issueRequest.memberName,
            issuedBy: issueRequest.issuedBy,
            issuedDateTime: new Date().toISOString()
        };
        return this.update(id, updateData);
    }
    async returnKey(id, returnedBy) {
        const key = await this.findOne(id);
        if (!key) {
            throw new Error('Key not found');
        }
        if (key.keyStatus !== 'issued') {
            throw new Error('Key is not currently issued');
        }
        const updateData = {
            keyStatus: 'available',
            memberName: 'Not Assigned',
            issuedBy: undefined,
            issuedDateTime: undefined,
            returnedDateTime: undefined
        };
        return this.update(id, updateData);
    }
    async getKeysByStatus(status) {
        return this.keyRepository.find({ where: { keyStatus: status } });
    }
    async getKeysByEquipment(equipmentName) {
        return this.keyRepository.find({
            where: {
                equipmentName: (0, typeorm_2.Like)(`%${equipmentName}%`)
            }
        });
    }
    async getKeysByMember(memberName) {
        return this.keyRepository.find({
            where: {
                memberName: (0, typeorm_2.Like)(`%${memberName}%`)
            }
        });
    }
    async getStatistics() {
        const total = await this.keyRepository.count();
        const available = await this.keyRepository.count({ where: { keyStatus: 'available' } });
        const issued = await this.keyRepository.count({ where: { keyStatus: 'issued' } });
        const returned = await this.keyRepository.count({ where: { keyStatus: 'returned' } });
        return {
            total,
            available,
            issued,
            returned
        };
    }
};
exports.KeysService = KeysService;
exports.KeysService = KeysService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(key_entity_1.KeyEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeysService);
//# sourceMappingURL=keys.service.js.map