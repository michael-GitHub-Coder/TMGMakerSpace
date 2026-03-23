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
exports.EmailTestController = void 0;
const common_1 = require("@nestjs/common");
const booking_email_service_1 = require("./bookings/booking-email.service");
const key_notification_service_1 = require("./keys/key-notification.service");
let EmailTestController = class EmailTestController {
    bookingEmailService;
    keyNotificationService;
    constructor(bookingEmailService, keyNotificationService) {
        this.bookingEmailService = bookingEmailService;
        this.keyNotificationService = keyNotificationService;
    }
    async testBookingEmail(testData) {
        try {
            const mockBooking = {
                id: 'TEST123',
                name: testData.name,
                surname: 'TestUser',
                email: testData.email,
                phone: '0000000000',
                machineType: 'Laser Cutter',
                pricePerHour: 200,
                bookingDate: '2026-03-25',
                bookingTime: '14:00',
                duration: 2,
                totalPrice: 400,
                status: 'confirmed',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await this.bookingEmailService.sendBookingConfirmation(mockBooking);
            return { success: true, message: 'Booking email sent successfully!' };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to send booking email',
                error: error.message,
                details: error
            };
        }
    }
    async testKeyEmail(testData) {
        try {
            const mockKeyData = {
                memberName: testData.name,
                memberEmail: testData.email,
                memberPhone: '0000000000',
                equipmentName: 'Laser Cutter',
                issuedBy: 'Test Admin',
                issuedDateTime: '2026-03-25 14:00',
            };
            await this.keyNotificationService.sendKeyIssuedNotification(mockKeyData);
            return { success: true, message: 'Key email sent successfully!' };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to send key email',
                error: error.message,
                details: error
            };
        }
    }
};
exports.EmailTestController = EmailTestController;
__decorate([
    (0, common_1.Post)('test-booking-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailTestController.prototype, "testBookingEmail", null);
__decorate([
    (0, common_1.Post)('test-key-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailTestController.prototype, "testKeyEmail", null);
exports.EmailTestController = EmailTestController = __decorate([
    (0, common_1.Controller)('email-test'),
    __metadata("design:paramtypes", [booking_email_service_1.BookingEmailService,
        key_notification_service_1.KeyNotificationService])
], EmailTestController);
//# sourceMappingURL=email-test.controller.js.map