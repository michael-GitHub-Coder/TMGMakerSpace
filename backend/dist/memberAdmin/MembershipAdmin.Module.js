"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipAdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const MembershipAdminController_1 = require("./MembershipAdminController");
const MembershipAdminService_1 = require("./MembershipAdminService");
const remove_member_controller_1 = require("./remove-member.controller");
const MembershipApplication_Entity_1 = require("../memberApplication/MembershipApplication.Entity");
const user_entity_1 = require("../users/user.entity");
const booking_email_service_1 = require("../bookings/booking-email.service");
const bookings_module_1 = require("../bookings/bookings.module");
let MembershipAdminModule = class MembershipAdminModule {
};
exports.MembershipAdminModule = MembershipAdminModule;
exports.MembershipAdminModule = MembershipAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([MembershipApplication_Entity_1.MembershipApplicationEntity, user_entity_1.User,]), bookings_module_1.BookingsModule],
        providers: [MembershipAdminService_1.MembershipAdminService, booking_email_service_1.BookingEmailService],
        controllers: [MembershipAdminController_1.MembershipAdminController, remove_member_controller_1.RemoveMemberController],
    })
], MembershipAdminModule);
//# sourceMappingURL=MembershipAdmin.Module.js.map