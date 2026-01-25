import { AuthService } from './auth.service';
import type { LoginDto, RegisterDto } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(loginDto: LoginDto): Promise<{
        status: string;
        message: string;
        token: string;
        data: {
            user: any;
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
            };
        };
    }>;
}
