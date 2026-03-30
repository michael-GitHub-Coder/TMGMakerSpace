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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var KeyNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyNotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let KeyNotificationService = KeyNotificationService_1 = class KeyNotificationService {
    configService;
    logger = new common_1.Logger(KeyNotificationService_1.name);
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
            port: parseInt(this.configService.get('EMAIL_PORT') || '465'),
            secure: true,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        });
    }
    async sendKeyIssuedNotification(data) {
        const subject = `Key Issued: ${data.equipmentName} - TMG Makerspace`;
        const emailContent = `
      Dear ${data.memberName},
      
      You have been issued a key for the following equipment at TMG Makerspace:
      
      📋 Equipment Details:
      • Equipment: ${data.equipmentName}
      • Issued by: ${data.issuedBy}
      • Date & Time: ${data.issuedDateTime}
      • Contact Email: ${data.memberEmail}
      • Contact Phone: ${data.memberPhone}
      
      ⚠️ Important Information:
      • Please return the key promptly after use 
      • You will receive a reminder email if the key is not returned within 30 minutes
      • Handle the equipment with care
      
      📍 Pick up Location: TMG Makerspace Admin Desk
      📞 For assistance: Contact TMG Makerspace staff
      
      Thank you for using TMG Makerspace facilities!
      
      Best regards,
      TMG Makerspace Team
    `;
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
                to: data.memberEmail,
                subject: subject,
                html: emailContent.replace(/\n/g, '<br>'),
            });
            this.logger.log(`[EMAIL NOTIFICATION] Key issued notification sent to ${data.memberEmail}`);
        }
        catch (error) {
            this.logger.error(`[EMAIL NOTIFICATION] Failed to send key issued notification:`, error);
            throw new Error(`Failed to send email notification: ${error.message}`);
        }
    }
    async sendKeyReturnReminder(data) {
        const subject = `⏰ Reminder: Return Key for ${data.equipmentName} - TMG Makerspace`;
        const emailContent = `
      Dear ${data.memberName},
      
      ⏰ REMINDER: Its almost time to return the key for ${data.equipmentName}. Please return it soon.
      
      📋 Issuance Details:
      • Equipment: ${data.equipmentName}
      • Issued by: ${data.issuedBy}
      • Issued at: ${data.issuedDateTime}
      
      🔑 Please return the key to:
      • TMG Makerspace Admin Desk
      • During operating hours
      
      ⚠️ Important:
      • Other members may be waiting for this equipment
      • Prompt return helps everyone access equipment fairly
      • Your cooperation is appreciated
      
      📞 Questions? Contact TMG Makerspace staff
      
      Thank you for your prompt attention to this matter.
      
      Best regards,
      TMG Makerspace Team
    `;
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
                to: data.memberEmail,
                subject: subject,
                html: emailContent.replace(/\n/g, '<br>'),
            });
            this.logger.log(`[EMAIL NOTIFICATION] Key return reminder sent to ${data.memberEmail}`);
        }
        catch (error) {
            this.logger.error(`[EMAIL NOTIFICATION] Failed to send key return reminder:`, error);
            throw new Error(`Failed to send reminder email: ${error.message}`);
        }
    }
    async sendKeyReturnedConfirmation(data) {
        const subject = `Key Returned Confirmation: ${data.equipmentName} - TMG Makerspace`;
        const emailContent = `
      Dear ${data.memberName},
      
      ✅ Thank you for returning the key for ${data.equipmentName}!
      
      📋 Return Details:
      • Equipment: ${data.equipmentName}
      • Originally issued by: ${data.issuedBy}
      • Issued at: ${data.issuedDateTime}
      • Returned at: ${data.returnedDateTime}
      
      🙏 Appreciation:
      • Thank you for your prompt return
      • Your cooperation helps other members access equipment
      • We appreciate you following TMG Makerspace policies
      
      🌟 We hope you had a productive session with the equipment!
      
      📞 Need anything else? Contact TMG Makerspace staff
      
      We look forward to seeing you again at TMG Makerspace.
      
      Best regards,
      TMG Makerspace Team.
    `;
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
                to: data.memberEmail,
                subject: subject,
                html: emailContent.replace(/\n/g, '<br>'),
            });
            this.logger.log(`[EMAIL NOTIFICATION] Key returned confirmation sent to ${data.memberEmail}`);
        }
        catch (error) {
            this.logger.error(`[EMAIL NOTIFICATION] Failed to send key returned confirmation:`, error);
            throw new Error(`Failed to send confirmation email: ${error.message}`);
        }
    }
};
exports.KeyNotificationService = KeyNotificationService;
exports.KeyNotificationService = KeyNotificationService = KeyNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KeyNotificationService);
//# sourceMappingURL=key-notification.service.js.map