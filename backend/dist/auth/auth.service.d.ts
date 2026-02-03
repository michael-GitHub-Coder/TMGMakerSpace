import { UsersService } from '../users/users.service';
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
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    private generateToken;
    login(loginDto: LoginDto): Promise<{
        status: string;
        message: string;
        data: {
            userId: any;
            email: any;
            user?: undefined;
        };
        token?: undefined;
    } | {
        status: string;
        message: string;
        token: string;
        data: {
            user: any;
            userId?: undefined;
            email?: undefined;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        status: string;
        message: string;
        token: string;
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
        data: {
            user: import("../users/user.entity").User;
        };
    }>;
}
