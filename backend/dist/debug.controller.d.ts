import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './memberApplication/MembershipApplication.Entity';
import { User } from './users/user.entity';
export declare class DebugController {
    private readonly membershipRepo;
    private readonly userRepo;
    constructor(membershipRepo: Repository<MembershipApplicationEntity>, userRepo: Repository<User>);
    getMemberInfo(email: string): Promise<{
        email: string;
        membership: {
            status: "pending" | "approved" | "rejected" | "info-required";
            hasOTP: boolean;
            otp: string | undefined;
        } | null;
        user: {
            role: string;
            hasPassword: boolean;
            mustChangePassword: boolean;
        } | null;
    }>;
}
