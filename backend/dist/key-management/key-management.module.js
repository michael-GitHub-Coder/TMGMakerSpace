"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManagementModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var key_management_service_1 = require("./key-management.service");
var key_management_controller_1 = require("./key-management.controller");
var key_management_entity_1 = require("./entities/key-management.entity");
var user_entity_1 = require("../users/user.entity");
var booking_entity_1 = require("../bookings/booking.entity");
var auth_module_1 = require("../auth/auth.module");
var KeyManagementModule = (function () {
    function KeyManagementModule() {
    }
    KeyManagementModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([key_management_entity_1.KeyManagementEntity, user_entity_1.User, booking_entity_1.BookingEntity]),
                auth_module_1.AuthModule,
            ],
            controllers: [key_management_controller_1.KeyManagementController],
            providers: [key_management_service_1.KeyManagementService],
            exports: [key_management_service_1.KeyManagementService],
        })
    ], KeyManagementModule);
    return KeyManagementModule;
}());
exports.KeyManagementModule = KeyManagementModule;
//# sourceMappingURL=key-management.module.js.map