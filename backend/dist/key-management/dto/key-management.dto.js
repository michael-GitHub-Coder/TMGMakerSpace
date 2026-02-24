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
exports.KeyHistoryDto = exports.KeyManagementResponseDto = exports.FilterKeysDto = exports.UpdateKeyManagementDto = exports.ReturnKeyDto = exports.IssueKeyDto = exports.CreateKeyManagementDto = void 0;
var class_validator_1 = require("class-validator");
var key_management_entity_1 = require("../entities/key-management.entity");
var CreateKeyManagementDto = (function () {
    function CreateKeyManagementDto() {
        this.status = key_management_entity_1.KeyStatus.AVAILABLE;
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(100),
        __metadata("design:type", String)
    ], CreateKeyManagementDto.prototype, "equipmentName", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(50),
        __metadata("design:type", String)
    ], CreateKeyManagementDto.prototype, "equipmentType", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(key_management_entity_1.KeyStatus),
        __metadata("design:type", String)
    ], CreateKeyManagementDto.prototype, "status", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(500),
        __metadata("design:type", String)
    ], CreateKeyManagementDto.prototype, "notes", void 0);
    return CreateKeyManagementDto;
}());
exports.CreateKeyManagementDto = CreateKeyManagementDto;
var IssueKeyDto = (function () {
    function IssueKeyDto() {
    }
    __decorate([
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], IssueKeyDto.prototype, "bookingId", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        __metadata("design:type", Number)
    ], IssueKeyDto.prototype, "issuedToUserId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(500),
        __metadata("design:type", String)
    ], IssueKeyDto.prototype, "notes", void 0);
    return IssueKeyDto;
}());
exports.IssueKeyDto = IssueKeyDto;
var ReturnKeyDto = (function () {
    function ReturnKeyDto() {
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(500),
        __metadata("design:type", String)
    ], ReturnKeyDto.prototype, "notes", void 0);
    return ReturnKeyDto;
}());
exports.ReturnKeyDto = ReturnKeyDto;
var UpdateKeyManagementDto = (function () {
    function UpdateKeyManagementDto() {
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(100),
        __metadata("design:type", String)
    ], UpdateKeyManagementDto.prototype, "equipmentName", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(50),
        __metadata("design:type", String)
    ], UpdateKeyManagementDto.prototype, "equipmentType", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(key_management_entity_1.KeyStatus),
        __metadata("design:type", String)
    ], UpdateKeyManagementDto.prototype, "status", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MaxLength)(500),
        __metadata("design:type", String)
    ], UpdateKeyManagementDto.prototype, "notes", void 0);
    return UpdateKeyManagementDto;
}());
exports.UpdateKeyManagementDto = UpdateKeyManagementDto;
var FilterKeysDto = (function () {
    function FilterKeysDto() {
        this.page = 1;
        this.limit = 10;
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(key_management_entity_1.KeyStatus),
        __metadata("design:type", String)
    ], FilterKeysDto.prototype, "status", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], FilterKeysDto.prototype, "equipmentName", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], FilterKeysDto.prototype, "equipmentType", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)(),
        __metadata("design:type", String)
    ], FilterKeysDto.prototype, "issuedFromDate", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)(),
        __metadata("design:type", String)
    ], FilterKeysDto.prototype, "issuedToDate", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(1),
        __metadata("design:type", Number)
    ], FilterKeysDto.prototype, "page", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(1),
        __metadata("design:type", Number)
    ], FilterKeysDto.prototype, "limit", void 0);
    return FilterKeysDto;
}());
exports.FilterKeysDto = FilterKeysDto;
var KeyManagementResponseDto = (function () {
    function KeyManagementResponseDto() {
    }
    return KeyManagementResponseDto;
}());
exports.KeyManagementResponseDto = KeyManagementResponseDto;
var KeyHistoryDto = (function () {
    function KeyHistoryDto() {
    }
    return KeyHistoryDto;
}());
exports.KeyHistoryDto = KeyHistoryDto;
//# sourceMappingURL=key-management.dto.js.map