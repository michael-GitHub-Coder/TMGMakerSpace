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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
let BookingsService = class BookingsService {
    bookingRepo;
    constructor(bookingRepo) {
        this.bookingRepo = bookingRepo;
    }
    async create(createBookingDto) {
        const startTime = new Date(`${createBookingDto.bookingDate}T${createBookingDto.bookingTime}`);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + createBookingDto.duration);
        const conflict = await this.bookingRepo
            .createQueryBuilder('booking')
            .where('booking.machineType = :machineType', { machineType: createBookingDto.machineType })
            .andWhere('booking.status != :cancelled', { cancelled: 'cancelled' })
            .andWhere('booking.bookingDate = :bookingDate', { bookingDate: createBookingDto.bookingDate })
            .andWhere(`(
          (booking.bookingTime <= :newStartTime AND DATEADD(hour, booking.duration, booking.bookingTime) > :newStartTime)
          OR
          (booking.bookingTime < :newEndTime AND DATEADD(hour, booking.duration, booking.bookingTime) >= :newEndTime)
          OR
          (booking.bookingTime >= :newStartTime AND DATEADD(hour, booking.duration, booking.bookingTime) <= :newEndTime)
        )`, { newStartTime: createBookingDto.bookingTime, newEndTime: endTime.toTimeString().slice(0, 5) })
            .getOne();
        if (conflict) {
            throw new common_1.ConflictException('This slot overlaps with an existing booking.');
        }
        const newBooking = this.bookingRepo.create({
            ...createBookingDto,
            id: `BK${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            status: 'pending'
        });
        return this.bookingRepo.save(newBooking);
    }
    findAll() {
        return this.bookingRepo.find({ order: { bookingDate: 'DESC', bookingTime: 'DESC' } });
    }
    async findOne(id) {
        const booking = await this.bookingRepo.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with id ${id} not found`);
        }
        return booking;
    }
    async update(id, dto) {
        const booking = await this.findOne(id);
        if (!booking)
            throw new common_1.NotFoundException();
        Object.assign(booking, dto);
        return this.bookingRepo.save(booking);
    }
    async delete(id) {
        const booking = await this.findOne(id);
        if (!booking)
            throw new common_1.NotFoundException();
        return this.bookingRepo.remove(booking);
    }
    async findByEmail(email) {
        const bookings = await this.bookingRepo.find({
            where: { email },
            order: { bookingDate: 'DESC', bookingTime: 'DESC' },
        });
        if (!bookings.length) {
            throw new common_1.NotFoundException(`No bookings found for email ${email}`);
        }
        return bookings;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.BookingEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map