import { MembershipService } from './Membership.Service';
import { UpdateMembershipDto } from './DTO/membership.dto';
export declare class MembershipController {
    private readonly membershipService;
    constructor(membershipService: MembershipService);
    apply(req: any, files: Express.Multer.File[]): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity>;
    getAllApplications(): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity[]>;
    approveApplication(id: number): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity>;
    rejectApplication(id: number, reason: string): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity>;
    findAll(): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity[]>;
    findOne(id: number): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity>;
    adminUpdate(id: number, dto: UpdateMembershipDto): Promise<import("./MembershipApplication.Entity").MembershipApplicationEntity>;
}
