"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookingDto = exports.CreateBookingDto = void 0;
class CreateBookingDto {
    role;
    name;
    surname;
    email;
    phone;
    machineType;
    pricePerHour;
    bookingDate;
    bookingTime;
    duration;
    totalPrice;
}
exports.CreateBookingDto = CreateBookingDto;
class UpdateBookingDto {
    status;
    bookingDate;
    bookingTime;
    duration;
    machineType;
}
exports.UpdateBookingDto = UpdateBookingDto;
//# sourceMappingURL=booking.entity.js.map