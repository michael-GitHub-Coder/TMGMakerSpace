import { AuthService } from './auth.service';
import type { LoginDto, RegisterDto } from './auth.service';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(loginDto: LoginDto): Promise<{
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
    signUp(registerDto: RegisterDto): Promise<{
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
