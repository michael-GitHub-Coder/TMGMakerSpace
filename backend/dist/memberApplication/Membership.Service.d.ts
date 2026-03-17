import { Repository } from 'typeorm';
import { MembershipApplicationEntity } from './MembershipApplication.Entity';
import { CreateMembershipDto, UpdateMembershipDto } from './DTO/membership.dto';
import { User } from 'src/users/user.entity';
export declare class MembershipService {
    private readonly membershipRepo;
    private readonly userRepo;
    constructor(membershipRepo: Repository<MembershipApplicationEntity>, userRepo: Repository<User>);
    apply(dto: CreateMembershipDto): Promise<MembershipApplicationEntity>;
    findAll(): Promise<MembershipApplicationEntity[]>;
    findOne(id: number): Promise<MembershipApplicationEntity>;
    adminUpdate(id: number, dto: UpdateMembershipDto): Promise<MembershipApplicationEntity>;
    getAllApplications(): Promise<MembershipApplicationEntity[]>;
    approveApplication(id: number): Promise<MembershipApplicationEntity>;
    rejectApplication(id: number, reason?: string): Promise<MembershipApplicationEntity>;
    private generateRandomPassword;
}
