import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
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
        token: string;
        data: {
            user: any;
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
            };
        };
    }>;
}
