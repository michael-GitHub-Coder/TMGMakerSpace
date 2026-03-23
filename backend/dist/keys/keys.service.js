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
const key_notification_service_1 = require("./key-notification.service");
class SouthAfricanDateTime {
    static SA_TIMEZONE = 'Africa/Johannesburg';
    static now() {
        const now = new Date();
        const saTime = new Date(now.toLocaleString("en-US", { timeZone: this.SA_TIMEZONE }));
        return this.formatClean(saTime);
    }
    static formatToSAST(date) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const saTime = new Date(dateObj.toLocaleString("en-US", { timeZone: this.SA_TIMEZONE }));
        return this.formatClean(saTime);
    }
    static formatForDisplay(date) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleString("en-ZA", {
            timeZone: this.SA_TIMEZONE,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    static formatClean(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}
let KeysService = class KeysService {
    keyRepository;
    keyNotificationService;
    constructor(keyRepository, keyNotificationService) {
        this.keyRepository = keyRepository;
        this.keyNotificationService = keyNotificationService;
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
        console.log(`[KEY SERVICE] Updating key ${id} with data:`, updateData);
        try {
            const updateResult = await this.keyRepository.update(id, updateData);
            console.log(`[KEY SERVICE] Database update result:`, updateResult);
            const updatedKey = await this.findOne(id);
            if (!updatedKey) {
                console.error(`[KEY SERVICE] Critical error: Key ${id} not found after update`);
                throw new Error('Key not found after update');
            }
            console.log(`[KEY SERVICE] Update successful. Updated key:`, updatedKey);
            return updatedKey;
        }
        catch (error) {
            console.error(`[KEY SERVICE] Database update failed for key ${id}:`, error);
            throw new Error(`Database update failed: ${error.message}`);
        }
    }
    scheduleReturnReminder(key) {
        const reminderTime = 30 * 60 * 1000;
        setTimeout(async () => {
            try {
                const currentKey = await this.findOne(key.id);
                if (currentKey && currentKey.keyStatus === 'issued') {
                    await this.keyNotificationService.sendKeyReturnReminder({
                        memberName: currentKey.memberName || 'Unknown',
                        memberEmail: currentKey.memberEmail || '',
                        equipmentName: currentKey.equipmentName,
                        issuedBy: currentKey.issuedBy || 'Unknown',
                        issuedDateTime: currentKey.issuedDateTime || ''
                    });
                    console.log(`[KEY REMINDER] 30-minute reminder sent for key ${key.id}`);
                }
            }
            catch (error) {
                console.error(`[KEY REMINDER] Failed to send reminder for key ${key.id}:`, error);
            }
        }, reminderTime);
    }
    async issueKey(id, issueRequest) {
        console.log(`[KEY ISSUANCE] Starting key issuance process for key ID: ${id}`);
        console.log(`[KEY ISSUANCE] Issue request data:`, issueRequest);
        const key = await this.findOne(id);
        if (!key) {
            console.error(`[KEY ISSUANCE] Key with ID ${id} not found in database`);
            throw new Error('Key not found');
        }
        if (key.keyStatus !== 'available') {
            console.error(`[KEY ISSUANCE] Key ${id} is not available. Current status: ${key.keyStatus}`);
            throw new Error('Key is already issued or returned');
        }
        const updateData = {
            keyStatus: 'issued',
            memberName: issueRequest.memberName,
            memberEmail: issueRequest.memberEmail,
            memberPhone: issueRequest.memberPhone,
            issuedBy: issueRequest.issuedBy,
            issuedDateTime: SouthAfricanDateTime.now()
        };
        console.log(`[KEY ISSUANCE] Updating key ${id} with data:`, updateData);
        try {
            const updateResult = await this.keyRepository.update(id, updateData);
            console.log(`[KEY ISSUANCE] Database update result:`, updateResult);
            const updatedKey = await this.findOne(id);
            if (!updatedKey) {
                console.error(`[KEY ISSUANCE] Critical error: Key ${id} not found after update`);
                throw new Error('Key not found after update - database operation may have failed');
            }
            const verificationData = {
                keyStatus: updatedKey.keyStatus,
                memberName: updatedKey.memberName,
                memberEmail: updatedKey.memberEmail,
                memberPhone: updatedKey.memberPhone,
                issuedBy: updatedKey.issuedBy,
                issuedDateTime: updatedKey.issuedDateTime
            };
            console.log(`[KEY ISSUANCE] Verification - Updated key data:`, verificationData);
            if (!updatedKey.memberName || !updatedKey.issuedBy || !updatedKey.issuedDateTime) {
                console.error(`[KEY ISSUANCE] Critical error: Missing required fields after update`, verificationData);
                throw new Error('Key issuance incomplete - missing required data');
            }
            console.log(`[KEY ISSUANCE] SUCCESS: Key ${id} successfully issued to ${issueRequest.memberName}`);
            try {
                await this.keyNotificationService.sendKeyIssuedNotification({
                    memberName: issueRequest.memberName,
                    memberEmail: issueRequest.memberEmail,
                    memberPhone: issueRequest.memberPhone,
                    equipmentName: key.equipmentName,
                    issuedBy: issueRequest.issuedBy,
                    issuedDateTime: SouthAfricanDateTime.now()
                });
                console.log(`[KEY ISSUANCE] Email notification sent to ${issueRequest.memberEmail}`);
                this.scheduleReturnReminder(updatedKey);
            }
            catch (emailError) {
                console.error(`[KEY ISSUANCE] Failed to send email notification:`, emailError);
            }
            return updatedKey;
        }
        catch (error) {
            console.error(`[KEY ISSUANCE] Database error during key issuance:`, error);
            throw new Error(`Failed to save key issuance to database: ${error.message}`);
        }
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
            memberEmail: undefined,
            memberPhone: undefined,
            issuedBy: undefined,
            issuedDateTime: undefined,
            returnedDateTime: SouthAfricanDateTime.now()
        };
        try {
            const updatedKey = await this.update(id, updateData);
            try {
                await this.keyNotificationService.sendKeyReturnedConfirmation({
                    memberName: key.memberName || 'Unknown',
                    memberEmail: key.memberEmail || '',
                    equipmentName: key.equipmentName,
                    issuedBy: key.issuedBy || 'Unknown',
                    issuedDateTime: key.issuedDateTime || '',
                    returnedDateTime: SouthAfricanDateTime.now()
                });
                console.log(`[KEY RETURN] Confirmation email sent to ${key.memberEmail}`);
            }
            catch (emailError) {
                console.error(`[KEY RETURN] Failed to send confirmation email:`, emailError);
            }
            return updatedKey;
        }
        catch (error) {
            console.error(`[KEY RETURN] Failed to return key ${id}:`, error);
            throw new Error(`Failed to return key: ${error.message}`);
        }
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        key_notification_service_1.KeyNotificationService])
], KeysService);
//# sourceMappingURL=keys.service.js.map