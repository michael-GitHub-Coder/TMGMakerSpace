"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const MembershipApplication_Entity_1 = require("../memberApplication/MembershipApplication.Entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    membershipApplicationRepo;
    constructor(usersService, jwtService, membershipApplicationRepo) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.membershipApplicationRepo = membershipApplicationRepo;
    }
    async validateUser(email, password) {
        console.log(`[AUTH] Validating user: ${email}`);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            console.log(`[AUTH] User not found: ${email}`);
            return null;
        }
        console.log(`[AUTH] User found: ${user.email}, role: ${user.role}`);
        if (user.role === 'member') {
            console.log(`[AUTH] Member login detected for: ${email}`);
            const membershipApplication = await this.membershipApplicationRepo.findOne({
                where: { email: email, status: 'approved' }
            });
            if (!membershipApplication) {
                console.log(`[AUTH] No approved membership application found for: ${email}`);
                return null;
            }
            if (!membershipApplication.oneTimePassword) {
                console.log(`[AUTH] No OTP found for member: ${email}`);
                return null;
            }
            const storedOtp = membershipApplication.oneTimePassword.trim().toUpperCase();
            const inputOtp = password.trim().toUpperCase();
            console.log(`[AUTH] Stored OTP: "${storedOtp}" (length: ${storedOtp.length})`);
            console.log(`[AUTH] Input OTP: "${inputOtp}" (length: ${inputOtp.length})`);
            const isOtpValid = storedOtp === inputOtp;
            console.log(`[AUTH] OTP validation result: ${isOtpValid}`);
            if (!isOtpValid) {
                console.log(`[AUTH] OTP mismatch - expected: "${storedOtp}", received: "${inputOtp}"`);
                return null;
            }
        }
        else {
            console.log(`[AUTH] Non-member login detected for: ${email}`);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(`[AUTH] Password validation result: ${isPasswordValid}`);
            if (!isPasswordValid)
                return null;
        }
        const { password: pwd, ...result } = user;
        console.log(`[AUTH] Login successful for: ${email}`);
        return result;
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.generateToken(user);
        return {
            status: 'success',
            message: 'Login successful',
            token,
            data: { user },
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser)
            throw new common_1.UnauthorizedException('User already exists');
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role,
        });
        const { password, ...result } = user;
        const token = this.generateToken(result);
        return {
            status: 'success',
            message: 'Registration successful',
            token,
            data: { user: result },
        };
    }
    async changePassword(dto) {
        const user = await this.usersService.findById(dto.userId);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.mustChangePassword = false;
        await this.usersService.update(user.id, user);
        const token = this.generateToken(user);
        return {
            status: 'success',
            message: 'Password changed successfully',
            token,
            data: { user },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(MembershipApplication_Entity_1.MembershipApplicationEntity)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map