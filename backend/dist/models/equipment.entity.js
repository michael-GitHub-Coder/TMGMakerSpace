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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipment = void 0;
const typeorm_1 = require("typeorm");
const key_entity_1 = require("./key.entity");
const booking_entity_1 = require("../bookings/booking.entity");
let Equipment = class Equipment {
    id;
    name;
    type;
    pricePerHour;
    status;
    description;
    requiresKey;
    keys;
    bookings;
    createdAt;
    updatedAt;
};
exports.Equipment = Equipment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Equipment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Equipment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Equipment.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Equipment.prototype, "pricePerHour", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Equipment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Equipment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Equipment.prototype, "requiresKey", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => key_entity_1.Key, key => key.equipment),
    __metadata("design:type", Array)
], Equipment.prototype, "keys", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.BookingEntity, booking => booking.equipment),
    __metadata("design:type", Array)
], Equipment.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Equipment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Equipment.prototype, "updatedAt", void 0);
exports.Equipment = Equipment = __decorate([
    (0, typeorm_1.Entity)('equipment')
], Equipment);
//# sourceMappingURL=equipment.entity.js.map