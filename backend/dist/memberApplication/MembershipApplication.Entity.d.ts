export declare class MembershipApplicationEntity {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    documents: string[];
    status: 'pending' | 'approved' | 'rejected' | 'info-required';
    oneTimePassword?: string;
    rejectionReason?: string;
    applicationCode: string;
    createdAt: Date;
    updatedAt: Date;
    adminComment: string;
}
