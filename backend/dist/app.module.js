"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const bookings_module_1 = require("./bookings/bookings.module");
const email_module_1 = require("./email/email.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const Membership_Module_1 = require("./memberApplication/Membership.Module");
const MembershipAdmin_Module_1 = require("./memberAdmin/MembershipAdmin.Module");
const keys_module_1 = require("./keys/keys.module");
const blogs_module_1 = require("./blogs/blogs.module");
const debug_controller_1 = require("./debug.controller");
const test_controller_1 = require("./test.controller");
const test_member_controller_1 = require("./test-member.controller");
const email_test_controller_1 = require("./email-test.controller");
const booking_email_service_1 = require("./bookings/booking-email.service");
const key_notification_service_1 = require("./keys/key-notification.service");
const MembershipApplication_Entity_1 = require("./memberApplication/MembershipApplication.Entity");
const user_entity_1 = require("./users/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['../.env', 'config.env'],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'Ntokz@084',
                database: 'TMGMakerSpace',
                autoLoadEntities: true,
                synchronize: true,
                ssl: false,
            }),
            typeorm_1.TypeOrmModule.forFeature([MembershipApplication_Entity_1.MembershipApplicationEntity, user_entity_1.User]),
            bookings_module_1.BookingsModule,
            email_module_1.EmailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            Membership_Module_1.MembershipModule,
            MembershipAdmin_Module_1.MembershipAdminModule,
            keys_module_1.KeysModule,
            blogs_module_1.BlogsModule,
        ],
        controllers: [app_controller_1.AppController, debug_controller_1.DebugController, test_controller_1.TestController, test_member_controller_1.TestMemberController, email_test_controller_1.EmailTestController],
        providers: [app_service_1.AppService, booking_email_service_1.BookingEmailService, key_notification_service_1.KeyNotificationService],
        exports: [typeorm_1.TypeOrmModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map