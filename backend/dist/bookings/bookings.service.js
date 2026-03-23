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
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const booking_email_service_1 = require("./booking-email.service");
let BookingsService = BookingsService_1 = class BookingsService {
    bookingRepo;
    bookingEmailService;
    logger = new common_1.Logger(BookingsService_1.name);
    constructor(bookingRepo, bookingEmailService) {
        this.bookingRepo = bookingRepo;
        this.bookingEmailService = bookingEmailService;
    }
    async create(createBookingDto) {
        this.logger.log(`[BOOKING] Creating booking for ${createBookingDto.email}`);
        this.logger.log(`[BOOKING] Booking data:`, createBookingDto);
        const conflict = await this.bookingRepo.findOne({
            where: {
                machineType: createBookingDto.machineType,
                bookingDate: createBookingDto.bookingDate,
                bookingTime: createBookingDto.bookingTime,
                status: (0, typeorm_2.Not)('cancelled')
            }
        });
        if (conflict) {
            this.logger.warn(`[BOOKING] Conflict detected for slot ${createBookingDto.bookingDate} ${createBookingDto.bookingTime}`);
            throw new common_1.ConflictException('This slot is already booked.');
        }
        const newBooking = this.bookingRepo.create({
            ...createBookingDto,
            id: `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            status: 'pending'
        });
        try {
            const savedBooking = await this.bookingRepo.save(newBooking);
            this.logger.log(`[BOOKING] Booking saved successfully: ${savedBooking.id}`);
            if (this.bookingEmailService) {
                try {
                    await this.bookingEmailService.sendBookingConfirmation(savedBooking);
                    this.logger.log(`[BOOKING] Confirmation email sent for booking ${savedBooking.id}`);
                }
                catch (emailError) {
                    this.logger.error(`[BOOKING] Failed to send confirmation email:`, emailError);
                }
            }
            else {
                this.logger.warn(`[BOOKING] BookingEmailService not available - skipping email`);
            }
            return savedBooking;
        }
        catch (saveError) {
            this.logger.error(`[BOOKING] Failed to save booking:`, saveError);
            throw saveError;
        }
    }
    findAll() {
        return this.bookingRepo.find({
            order: { bookingDate: 'DESC', bookingTime: 'DESC' }
        });
    }
    async findOne(id) {
        const booking = await this.bookingRepo.findOne({ where: { id } });
        if (!booking) {
            throw new Error('Booking not found');
        }
        return booking;
    }
    async update(id, updateBookingDto) {
        const booking = await this.findOne(id);
        Object.assign(booking, updateBookingDto);
        return this.bookingRepo.save(booking);
    }
    async remove(id) {
        const booking = await this.findOne(id);
        await this.bookingRepo.remove(booking);
    }
    async findByEmail(email) {
        return this.bookingRepo.find({
            where: { email },
            order: { bookingDate: 'DESC', bookingTime: 'DESC' }
        });
    }
    async delete(id) {
        await this.remove(id);
    }
    async cancel(id) {
        const booking = await this.findOne(id);
        if (booking.status === 'cancelled') {
            throw new Error('Booking is already cancelled');
        }
        booking.status = 'cancelled';
        try {
            const cancelledBooking = await this.bookingRepo.save(booking);
            this.logger.log(`[BOOKING] Booking ${id} cancelled successfully`);
            return cancelledBooking;
        }
        catch (error) {
            this.logger.error(`[BOOKING] Failed to cancel booking ${id}:`, error);
            throw new Error('Failed to cancel booking');
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.BookingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        booking_email_service_1.BookingEmailService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map