import { MembershipAdminService } from './MembershipAdminService';
export declare class MembershipAdminController {
    private readonly service;
    constructor(service: MembershipAdminService);
    approve(id: number): Promise<{
        message: string;
        email: string;
        oneTimePassword: string;
    }>;
    reject(id: number, reason: string): Promise<import("../memberApplication/MembershipApplication.Entity").MembershipApplicationEntity>;
    requestMoreInfo(id: number, comment: string): Promise<import("../memberApplication/MembershipApplication.Entity").MembershipApplicationEntity>;
    getAllMembers(): Promise<import("../users/user.entity").User[]>;
    deleteMember(id: number): Promise<{
        message: string;
    }>;
}
