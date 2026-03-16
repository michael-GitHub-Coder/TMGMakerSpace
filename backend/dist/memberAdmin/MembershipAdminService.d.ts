import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { MembershipApplicationEntity } from 'src/memberApplication/MembershipApplication.Entity';
export declare class MembershipAdminService {
    private membershipRepo;
    private userRepo;
    constructor(membershipRepo: Repository<MembershipApplicationEntity>, userRepo: Repository<User>);
    approve(id: number): Promise<{
        message: string;
        email: string;
        oneTimePassword: string;
    }>;
    reject(id: number, reason: string): Promise<MembershipApplicationEntity>;
    requestMoreInfo(id: number, comment: string): Promise<MembershipApplicationEntity>;
    getAllMembers(): Promise<User[]>;
    deleteMember(id: number): Promise<{
        message: string;
    }>;
}
