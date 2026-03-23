import { AuthService } from './auth/auth.service';
export declare class TestController {
    private readonly authService;
    constructor(authService: AuthService);
    testMemberLogin(loginData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: any;
        token: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        user?: undefined;
        token?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        user?: undefined;
        token?: undefined;
    }>;
}
