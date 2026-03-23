import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './memberApplication/MembershipApplication.Entity';
import { User } from './users/user.entity';
import { AuthService } from './auth/auth.service';
export declare class TestMemberController {
    private readonly membershipRepo;
    private readonly userRepo;
    private readonly authService;
    constructor(membershipRepo: Repository<MembershipApplicationEntity>, userRepo: Repository<User>, authService: AuthService);
    checkAllMembers(): Promise<{
        totalApplications: number;
        approvedApplications: MembershipApplicationEntity[];
        totalUsers: number;
        memberUsers: User[];
        allApplications: {
            email: string;
            status: "pending" | "approved" | "rejected" | "info-required";
            hasOTP: boolean;
            otp: string | undefined;
            name: string;
            surname: string;
        }[];
        allUsers: {
            email: string;
            role: string;
            hasPassword: boolean;
            mustChangePassword: boolean;
            firstName: string;
            lastName: string;
        }[];
    }>;
    testLogin(loginData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        user: any;
        message: string;
    }>;
    getMemberDetails(email: string): Promise<{
        email: string;
        membership: {
            status: "pending" | "approved" | "rejected" | "info-required";
            hasOTP: boolean;
            otp: string | undefined;
            name: string;
            surname: string;
        } | null;
        user: {
            role: string;
            hasPassword: boolean;
            mustChangePassword: boolean;
            firstName: string;
            lastName: string;
        } | null;
    }>;
}
