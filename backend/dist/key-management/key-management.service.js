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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var key_management_entity_1 = require("./entities/key-management.entity");
var user_entity_1 = require("../users/user.entity");
var booking_entity_1 = require("../bookings/booking.entity");
var KeyManagementService = (function () {
    function KeyManagementService(keyRepository, userRepository, bookingRepository) {
        this.keyRepository = keyRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }
    KeyManagementService.prototype.createKey = function (createKeyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var key, savedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.keyRepository.create(createKeyDto);
                        return [4, this.keyRepository.save(key)];
                    case 1:
                        savedKey = _a.sent();
                        return [2, this.formatKeyResponse(savedKey)];
                }
            });
        });
    };
    KeyManagementService.prototype.getAllKeys = function (filterDto) {
        return __awaiter(this, void 0, void 0, function () {
            var status, equipmentName, equipmentType, issuedFromDate, issuedToDate, _a, page, _b, limit, where, _c, keys, total, formattedKeys;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        status = filterDto.status, equipmentName = filterDto.equipmentName, equipmentType = filterDto.equipmentType, issuedFromDate = filterDto.issuedFromDate, issuedToDate = filterDto.issuedToDate, _a = filterDto.page, page = _a === void 0 ? 1 : _a, _b = filterDto.limit, limit = _b === void 0 ? 10 : _b;
                        where = {};
                        if (status)
                            where.status = status;
                        if (equipmentName)
                            where.equipmentName = (0, typeorm_2.Like)("%".concat(equipmentName, "%"));
                        if (equipmentType)
                            where.equipmentType = (0, typeorm_2.Like)("%".concat(equipmentType, "%"));
                        if (issuedFromDate && issuedToDate) {
                            where.issuedAt = (0, typeorm_2.Between)(new Date(issuedFromDate), new Date(issuedToDate));
                        }
                        else if (issuedFromDate) {
                            where.issuedAt = (0, typeorm_2.Between)(new Date(issuedFromDate), new Date());
                        }
                        return [4, this.keyRepository.findAndCount({
                                where: where,
                                relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                                order: { createdAt: 'DESC' },
                                take: limit,
                                skip: (page - 1) * limit,
                            })];
                    case 1:
                        _c = _d.sent(), keys = _c[0], total = _c[1];
                        formattedKeys = keys.map(function (key) { return _this.formatKeyResponse(key); });
                        return [2, { keys: formattedKeys, total: total }];
                }
            });
        });
    };
    KeyManagementService.prototype.getKeyById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.findOne({
                            where: { id: id },
                            relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                        })];
                    case 1:
                        key = _a.sent();
                        if (!key) {
                            throw new common_1.NotFoundException('Key not found');
                        }
                        return [2, this.formatKeyResponse(key)];
                }
            });
        });
    };
    KeyManagementService.prototype.updateKey = function (id, updateKeyDto) {
        return __awaiter(this, void 0, void 0, function () {
            var key, updatedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.findOne({ where: { id: id } })];
                    case 1:
                        key = _a.sent();
                        if (!key) {
                            throw new common_1.NotFoundException('Key not found');
                        }
                        Object.assign(key, updateKeyDto);
                        return [4, this.keyRepository.save(key)];
                    case 2:
                        updatedKey = _a.sent();
                        return [2, this.formatKeyResponse(updatedKey)];
                }
            });
        });
    };
    KeyManagementService.prototype.deleteKey = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.findOne({ where: { id: id } })];
                    case 1:
                        key = _a.sent();
                        if (!key) {
                            throw new common_1.NotFoundException('Key not found');
                        }
                        if (key.status === key_management_entity_1.KeyStatus.ISSUED) {
                            throw new common_1.BadRequestException('Cannot delete a key that is currently issued');
                        }
                        return [4, this.keyRepository.remove(key)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    KeyManagementService.prototype.issueKey = function (id, issueKeyDto, adminId) {
        return __awaiter(this, void 0, void 0, function () {
            var key, booking, user, existingKeyForBooking, updatedKey, savedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.findOne({
                            where: { id: id },
                            relations: ['issuedToUser', 'booking', 'issuedByAdmin'],
                        })];
                    case 1:
                        key = _a.sent();
                        if (!key) {
                            throw new common_1.NotFoundException('Key not found');
                        }
                        if (key.status !== key_management_entity_1.KeyStatus.AVAILABLE) {
                            throw new common_1.BadRequestException('Key is not available for issuance');
                        }
                        return [4, this.bookingRepository.findOne({ where: { id: issueKeyDto.bookingId } })];
                    case 2:
                        booking = _a.sent();
                        if (!booking) {
                            throw new common_1.NotFoundException('Booking not found');
                        }
                        if (booking.status !== 'confirmed') {
                            throw new common_1.BadRequestException('Key can only be issued for confirmed bookings');
                        }
                        return [4, this.userRepository.findOne({ where: { id: issueKeyDto.issuedToUserId } })];
                    case 3:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        return [4, this.keyRepository.findOne({
                                where: { bookingId: issueKeyDto.bookingId, status: key_management_entity_1.KeyStatus.ISSUED },
                            })];
                    case 4:
                        existingKeyForBooking = _a.sent();
                        if (existingKeyForBooking) {
                            throw new common_1.BadRequestException('A key has already been issued for this booking');
                        }
                        key.status = key_management_entity_1.KeyStatus.ISSUED;
                        key.issuedToUserId = issueKeyDto.issuedToUserId;
                        key.bookingId = issueKeyDto.bookingId;
                        key.issuedByAdminId = adminId;
                        key.issuedAt = new Date();
                        key.notes = issueKeyDto.notes || key.notes;
                        return [4, this.keyRepository.save(key)];
                    case 5:
                        updatedKey = _a.sent();
                        return [4, this.keyRepository.findOne({
                                where: { id: id },
                                relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                            })];
                    case 6:
                        savedKey = _a.sent();
                        return [2, this.formatKeyResponse(savedKey)];
                }
            });
        });
    };
    KeyManagementService.prototype.returnKey = function (id, returnKeyDto, adminId) {
        return __awaiter(this, void 0, void 0, function () {
            var key, updatedKey, savedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.findOne({
                            where: { id: id },
                            relations: ['issuedToUser', 'booking', 'issuedByAdmin'],
                        })];
                    case 1:
                        key = _a.sent();
                        if (!key) {
                            throw new common_1.NotFoundException('Key not found');
                        }
                        if (key.status !== key_management_entity_1.KeyStatus.ISSUED) {
                            throw new common_1.BadRequestException('Key is not currently issued');
                        }
                        key.status = key_management_entity_1.KeyStatus.RETURNED;
                        key.returnedByAdminId = adminId;
                        key.returnedAt = new Date();
                        if (returnKeyDto.notes) {
                            key.notes = returnKeyDto.notes;
                        }
                        return [4, this.keyRepository.save(key)];
                    case 2:
                        updatedKey = _a.sent();
                        return [4, this.keyRepository.findOne({
                                where: { id: id },
                                relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                            })];
                    case 3:
                        savedKey = _a.sent();
                        return [2, this.formatKeyResponse(savedKey)];
                }
            });
        });
    };
    KeyManagementService.prototype.getKeyHistory = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var key, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.findOne({
                            where: { id: id },
                            relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                        })];
                    case 1:
                        key = _a.sent();
                        if (!key) {
                            throw new common_1.NotFoundException('Key not found');
                        }
                        history = [];
                        if (key.issuedAt && key.issuedByAdmin) {
                            history.push({
                                id: "".concat(key.id, "-issued"),
                                action: 'issued',
                                performedBy: {
                                    id: key.issuedByAdmin.id,
                                    firstName: key.issuedByAdmin.firstName,
                                    lastName: key.issuedByAdmin.lastName,
                                    email: key.issuedByAdmin.email,
                                },
                                performedAt: key.issuedAt,
                                notes: key.notes,
                                user: key.issuedToUser ? {
                                    id: key.issuedToUser.id,
                                    firstName: key.issuedToUser.firstName,
                                    lastName: key.issuedToUser.lastName,
                                    email: key.issuedToUser.email,
                                } : undefined,
                                booking: key.booking ? {
                                    id: key.booking.id,
                                    bookingDate: key.booking.bookingDate,
                                    bookingTime: key.booking.bookingTime,
                                } : undefined,
                            });
                        }
                        if (key.returnedAt && key.returnedByAdmin) {
                            history.push({
                                id: "".concat(key.id, "-returned"),
                                action: 'returned',
                                performedBy: {
                                    id: key.returnedByAdmin.id,
                                    firstName: key.returnedByAdmin.firstName,
                                    lastName: key.returnedByAdmin.lastName,
                                    email: key.returnedByAdmin.email,
                                },
                                performedAt: key.returnedAt,
                                notes: key.notes,
                            });
                        }
                        return [2, history.sort(function (a, b) { return b.performedAt.getTime() - a.performedAt.getTime(); })];
                }
            });
        });
    };
    KeyManagementService.prototype.getKeysByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.find({
                            where: { issuedToUserId: userId },
                            relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                            order: { createdAt: 'DESC' },
                        })];
                    case 1:
                        keys = _a.sent();
                        return [2, keys.map(function (key) { return _this.formatKeyResponse(key); })];
                }
            });
        });
    };
    KeyManagementService.prototype.getOverdueKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.keyRepository.find({
                            where: { status: key_management_entity_1.KeyStatus.ISSUED },
                            relations: ['issuedToUser', 'booking', 'issuedByAdmin', 'returnedByAdmin'],
                            order: { issuedAt: 'ASC' },
                        })];
                    case 1:
                        keys = _a.sent();
                        return [2, keys.map(function (key) { return _this.formatKeyResponse(key); })];
                }
            });
        });
    };
    KeyManagementService.prototype.formatKeyResponse = function (key) {
        return {
            id: key.id,
            equipmentName: key.equipmentName,
            equipmentType: key.equipmentType,
            status: key.status,
            issuedToUser: key.issuedToUser ? {
                id: key.issuedToUser.id,
                firstName: key.issuedToUser.firstName,
                lastName: key.issuedToUser.lastName,
                email: key.issuedToUser.email,
            } : undefined,
            booking: key.booking ? {
                id: key.booking.id,
                bookingDate: key.booking.bookingDate,
                bookingTime: key.booking.bookingTime,
                duration: key.booking.duration,
            } : undefined,
            issuedByAdmin: key.issuedByAdmin ? {
                id: key.issuedByAdmin.id,
                firstName: key.issuedByAdmin.firstName,
                lastName: key.issuedByAdmin.lastName,
                email: key.issuedByAdmin.email,
            } : undefined,
            issuedAt: key.issuedAt,
            returnedByAdmin: key.returnedByAdmin ? {
                id: key.returnedByAdmin.id,
                firstName: key.returnedByAdmin.firstName,
                lastName: key.returnedByAdmin.lastName,
                email: key.returnedByAdmin.email,
            } : undefined,
            returnedAt: key.returnedAt,
            notes: key.notes,
            createdAt: key.createdAt,
            updatedAt: key.updatedAt,
        };
    };
    KeyManagementService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(key_management_entity_1.KeyManagementEntity)),
        __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
        __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.BookingEntity)),
        __metadata("design:paramtypes", [typeorm_2.Repository,
            typeorm_2.Repository,
            typeorm_2.Repository])
    ], KeyManagementService);
    return KeyManagementService;
}());
exports.KeyManagementService = KeyManagementService;
//# sourceMappingURL=key-management.service.js.map