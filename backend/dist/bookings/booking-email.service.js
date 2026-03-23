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
var BookingEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let BookingEmailService = BookingEmailService_1 = class BookingEmailService {
    configService;
    logger = new common_1.Logger(BookingEmailService_1.name);
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
    async sendBookingConfirmation(booking) {
        const subject = `Booking Confirmation: ${booking.machineType} - TMG Makerspace`;
        const emailContent = `
      Dear ${booking.name} ${booking.surname},
      
      ✅ Your equipment booking has been confirmed at TMG Makerspace!
      
      📋 Booking Details:
      • Booking ID: ${booking.id}
      • Equipment: ${booking.machineType}
      • Date: ${booking.bookingDate}
      • Time: ${booking.bookingTime}
      • Duration: ${booking.duration} hour(s)
      • Total Price: R${booking.totalPrice.toFixed(2)}
      
      📍 Important Information:
      • Please arrive 10 minutes before your booking time
      • Bring your ID for verification
      • Equipment will be available for pickup at admin desk
      
      ⚠️ Cancellation Policy:
      • Cancellations must be made at least 2 hours before booking time
      • No-shows may be charged the full booking fee
      • Contact admin for any changes
      
      📞 Questions? Contact TMG Makerspace staff
      
      We look forward to seeing you at TMG Makerspace!
      
      Best regards,
      TMG Makerspace Team
    `;
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
                to: booking.email,
                subject: subject,
                html: emailContent.replace(/\n/g, '<br>'),
            });
            this.logger.log(`[BOOKING EMAIL] Confirmation sent to ${booking.email} for ${booking.machineType}`);
        }
        catch (error) {
            this.logger.error(`[BOOKING EMAIL] Failed to send booking confirmation:`, error);
            throw new Error(`Failed to send booking confirmation email: ${error.message}`);
        }
    }
    async sendBookingReminder(booking) {
        const subject = `Reminder: Upcoming Booking - ${booking.machineType} - TMG Makerspace`;
        const emailContent = `
      Dear ${booking.name} ${booking.surname},
      
      ⏰ REMINDER: You have an upcoming booking at TMG Makerspace.
      
      📋 Booking Details:
      • Booking ID: ${booking.id}
      • Equipment: ${booking.machineType}
      • Date: ${booking.bookingDate}
      • Time: ${booking.bookingTime}
      • Duration: ${booking.duration} hour(s)
      
      📍 Reminder:
      • Your booking is coming up soon
      • Please arrive 10 minutes early
      • Bring your ID for verification
      
      📞 Questions? Contact TMG Makerspace staff
      
      See you soon at TMG Makerspace!
      
      Best regards,
      TMG Makerspace Team
    `;
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
                to: booking.email,
                subject: subject,
                html: emailContent.replace(/\n/g, '<br>'),
            });
            this.logger.log(`[BOOKING EMAIL] Reminder sent to ${booking.email} for ${booking.machineType}`);
        }
        catch (error) {
            this.logger.error(`[BOOKING EMAIL] Failed to send booking reminder:`, error);
            throw new Error(`Failed to send booking reminder email: ${error.message}`);
        }
    }
};
exports.BookingEmailService = BookingEmailService;
exports.BookingEmailService = BookingEmailService = BookingEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BookingEmailService);
//# sourceMappingURL=booking-email.service.js.map