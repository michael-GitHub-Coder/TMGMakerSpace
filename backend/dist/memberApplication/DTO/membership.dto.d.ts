export declare class CreateMembershipDto {
    name: string;
    surname: string;
    email: string;
    phone: string;
    documents: string[];
}
export declare class UpdateMembershipDto {
    status?: 'approved' | 'rejected' | 'more_info_required';
    adminComment?: string;
    rejectionReason?: string;
}
