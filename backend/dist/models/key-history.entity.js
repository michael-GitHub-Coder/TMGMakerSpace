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
exports.KeyHistory = void 0;
const typeorm_1 = require("typeorm");
const key_entity_1 = require("./key.entity");
const user_entity_1 = require("../users/user.entity");
let KeyHistory = class KeyHistory {
    id;
    key;
    keyId;
    action;
    member;
    memberId;
    admin;
    adminId;
    actionDate;
    notes;
    createdAt;
};
exports.KeyHistory = KeyHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KeyHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => key_entity_1.Key, key => key.history),
    (0, typeorm_1.JoinColumn)({ name: 'keyId' }),
    __metadata("design:type", key_entity_1.Key)
], KeyHistory.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KeyHistory.prototype, "keyId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KeyHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'memberId' }),
    __metadata("design:type", user_entity_1.User)
], KeyHistory.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KeyHistory.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'adminId' }),
    __metadata("design:type", user_entity_1.User)
], KeyHistory.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KeyHistory.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], KeyHistory.prototype, "actionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], KeyHistory.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KeyHistory.prototype, "createdAt", void 0);
exports.KeyHistory = KeyHistory = __decorate([
    (0, typeorm_1.Entity)('key_history')
], KeyHistory);
//# sourceMappingURL=key-history.entity.js.map