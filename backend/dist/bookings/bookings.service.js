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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/email.service");
let BookingsService = class BookingsService {
    emailService;
    bookings = [];
    idCounter = 1;
    constructor(emailService) {
        this.emailService = emailService;
    }
    toDateTime(date, time) {
        return new Date(`${date}T${time}`);
    }
    hasConflict(date, time, duration, machineType, excludeId) {
        const newStart = this.toDateTime(date, time);
        const newEnd = new Date(newStart.getTime() + duration * 60 * 60 * 1000);
        return this.bookings.some((b) => {
            if (b.id === excludeId)
                return false;
            if (b.status === 'cancelled')
                return false;
            if (b.machineType !== machineType)
                return false;
            const existingStart = this.toDateTime(b.bookingDate, b.bookingTime);
            const existingEnd = new Date(existingStart.getTime() + b.duration * 60 * 60 * 1000);
            const overlap = newStart < existingEnd && newEnd > existingStart;
            return overlap;
        });
    }
    async create(createBookingDto) {
        const { bookingDate, bookingTime, duration, machineType } = createBookingDto;
        if (this.hasConflict(bookingDate, bookingTime, duration, machineType)) {
            throw new common_1.ConflictException('This time slot is already booked for the selected machine');
        }
        const newId = `BK${String(this.idCounter++).padStart(4, '0')}`;
        const now = new Date();
        const booking = {
            ...createBookingDto,
            id: newId,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
            pricePerHour: createBookingDto.pricePerHour || 0,
            totalPrice: createBookingDto.totalPrice || 0,
            duration: Number(createBookingDto.duration) || 1
        };
        this.bookings.push(booking);
        try {
            await this.emailService.sendBookingConfirmation(booking);
            await this.emailService.sendAdminNotification(booking);
        }
        catch (error) {
            console.error('Failed to send email notifications:', error);
        }
        console.log('New booking created:', booking);
        return booking;
    }
    findAll() {
        return this.bookings.sort((a, b) => new Date(`${b.bookingDate}T${b.bookingTime}`).getTime() -
            new Date(`${a.bookingDate}T${a.bookingTime}`).getTime());
    }
    findOne(id) {
        const booking = this.bookings.find((b) => b.id === id);
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    update(id, updateBookingDto) {
        const index = this.bookings.findIndex((b) => b.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        const old = this.bookings[index];
        const newDate = updateBookingDto.bookingDate || old.bookingDate;
        const newTime = updateBookingDto.bookingTime || old.bookingTime;
        const newDuration = updateBookingDto.duration ?? old.duration;
        const newMachine = updateBookingDto.machineType || old.machineType;
        if (this.hasConflict(newDate, newTime, newDuration, newMachine, id)) {
            throw new common_1.ConflictException('This time slot is already booked for the selected machine');
        }
        this.bookings[index] = {
            ...old,
            ...updateBookingDto,
            updatedAt: new Date(),
        };
        return this.bookings[index];
    }
    cancel(id) {
        return this.update(id, { status: 'cancelled' });
    }
    delete(id) {
        const index = this.bookings.findIndex((b) => b.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        this.bookings.splice(index, 1);
    }
    getAvailableSlots(date, machineType) {
        const allSlots = this.generateTimeSlots();
        const bookedSlots = this.bookings
            .filter((b) => b.bookingDate === date &&
            b.machineType === machineType &&
            b.status !== 'cancelled')
            .map((b) => b.bookingTime);
        return allSlots.filter((slot) => !bookedSlots.includes(slot));
    }
    generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour < 18; hour++) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
        }
        return slots;
    }
    getStatistics() {
        const total = this.bookings.length;
        const confirmed = this.bookings.filter((b) => b.status === 'confirmed').length;
        const pending = this.bookings.filter((b) => b.status === 'pending').length;
        const cancelled = this.bookings.filter((b) => b.status === 'cancelled').length;
        const totalRevenue = this.bookings
            .filter((b) => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.totalPrice, 0);
        return {
            total,
            confirmed,
            pending,
            cancelled,
            totalRevenue,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => email_service_1.EmailService))),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map