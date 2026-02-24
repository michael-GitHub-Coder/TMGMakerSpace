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
exports.KeyManagementEntity = exports.KeyStatus = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users/user.entity");
var booking_entity_1 = require("../../bookings/booking.entity");
var KeyStatus;
(function (KeyStatus) {
    KeyStatus["AVAILABLE"] = "available";
    KeyStatus["ISSUED"] = "issued";
    KeyStatus["RETURNED"] = "returned";
})(KeyStatus || (exports.KeyStatus = KeyStatus = {}));
var KeyManagementEntity = (function () {
    function KeyManagementEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        __metadata("design:type", String)
    ], KeyManagementEntity.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], KeyManagementEntity.prototype, "equipmentName", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], KeyManagementEntity.prototype, "equipmentType", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            enum: KeyStatus,
            default: KeyStatus.AVAILABLE,
        }),
        __metadata("design:type", String)
    ], KeyManagementEntity.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], KeyManagementEntity.prototype, "issuedToUserId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: true }),
        (0, typeorm_1.JoinColumn)({ name: 'issuedToUserId' }),
        __metadata("design:type", user_entity_1.User)
    ], KeyManagementEntity.prototype, "issuedToUser", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], KeyManagementEntity.prototype, "bookingId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return booking_entity_1.BookingEntity; }, { nullable: true }),
        (0, typeorm_1.JoinColumn)({ name: 'bookingId' }),
        __metadata("design:type", booking_entity_1.BookingEntity)
    ], KeyManagementEntity.prototype, "booking", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], KeyManagementEntity.prototype, "issuedByAdminId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: true }),
        (0, typeorm_1.JoinColumn)({ name: 'issuedByAdminId' }),
        __metadata("design:type", user_entity_1.User)
    ], KeyManagementEntity.prototype, "issuedByAdmin", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], KeyManagementEntity.prototype, "issuedAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], KeyManagementEntity.prototype, "returnedByAdminId", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: true }),
        (0, typeorm_1.JoinColumn)({ name: 'returnedByAdminId' }),
        __metadata("design:type", user_entity_1.User)
    ], KeyManagementEntity.prototype, "returnedByAdmin", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], KeyManagementEntity.prototype, "returnedAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], KeyManagementEntity.prototype, "notes", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], KeyManagementEntity.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], KeyManagementEntity.prototype, "updatedAt", void 0);
    KeyManagementEntity = __decorate([
        (0, typeorm_1.Entity)('equipment_keys')
    ], KeyManagementEntity);
    return KeyManagementEntity;
}());
exports.KeyManagementEntity = KeyManagementEntity;
//# sourceMappingURL=key-management.entity.js.map