import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from '../memberApplication/MembershipApplication.Entity';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';
export interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private membershipApplicationRepo;
    constructor(usersService: UsersService, jwtService: JwtService, membershipApplicationRepo: Repository<MembershipApplicationEntity>);
    validateUser(email: string, password: string): Promise<any>;
    generateToken(user: any, rememberMe?: boolean): string;
    login(loginDto: LoginDto): Promise<{
        status: string;
        message: string;
        token: string;
        expiresIn: string;
        data: {
            user: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        status: string;
        message: string;
        token: string;
        expiresIn: string;
        data: {
            user: {
                id: number;
                firstName: string;
                lastName: string;
                email: string;
                role: string;
                mustChangePassword: boolean;
            };
        };
    }>;
    changePassword(dto: ChangePasswordDto): Promise<{
        status: string;
        message: string;
        token: string;
        expiresIn: string;
        data: {
            user: import("../users/user.entity").User;
        };
    }>;
}
