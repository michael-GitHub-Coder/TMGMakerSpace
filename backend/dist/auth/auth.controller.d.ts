import { AuthService } from './auth.service';
import type { LoginDto, RegisterDto } from './auth.service';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(loginDto: LoginDto): Promise<{
        status: string;
        message: string;
        token: string;
        expiresIn: string;
        data: {
            user: any;
        };
    }>;
    signUp(registerDto: RegisterDto): Promise<{
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
