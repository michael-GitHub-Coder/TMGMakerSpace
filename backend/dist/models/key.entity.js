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
exports.Key = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const equipment_entity_1 = require("./equipment.entity");
const key_history_entity_1 = require("./key-history.entity");
let Key = class Key {
    id;
    equipment;
    equipmentId;
    status;
    currentHolder;
    currentHolderId;
    issuedBy;
    issuedById;
    issuedAt;
    returnedAt;
    returnedBy;
    returnedById;
    history;
    createdAt;
    updatedAt;
};
exports.Key = Key;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Key.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => equipment_entity_1.Equipment, equipment => equipment.keys),
    (0, typeorm_1.JoinColumn)({ name: 'equipmentId' }),
    __metadata("design:type", equipment_entity_1.Equipment)
], Key.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Key.prototype, "equipmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'available' }),
    __metadata("design:type", String)
], Key.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'currentHolderId' }),
    __metadata("design:type", user_entity_1.User)
], Key.prototype, "currentHolder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Key.prototype, "currentHolderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'issuedById' }),
    __metadata("design:type", user_entity_1.User)
], Key.prototype, "issuedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Key.prototype, "issuedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Key.prototype, "issuedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Key.prototype, "returnedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'returnedById' }),
    __metadata("design:type", user_entity_1.User)
], Key.prototype, "returnedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Key.prototype, "returnedById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => key_history_entity_1.KeyHistory, history => history.key),
    __metadata("design:type", Array)
], Key.prototype, "history", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Key.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Key.prototype, "updatedAt", void 0);
exports.Key = Key = __decorate([
    (0, typeorm_1.Entity)('keys')
], Key);
//# sourceMappingURL=key.entity.js.map