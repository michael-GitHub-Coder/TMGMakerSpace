import { KeyStatus } from '../entities/key-management.entity';
export declare class CreateKeyManagementDto {
    equipmentName: string;
    equipmentType: string;
    status?: KeyStatus;
    notes?: string;
}
export declare class IssueKeyDto {
    bookingId: string;
    issuedToUserId: number;
    notes?: string;
}
export declare class ReturnKeyDto {
    notes?: string;
}
export declare class UpdateKeyManagementDto {
    equipmentName?: string;
    equipmentType?: string;
    status?: KeyStatus;
    notes?: string;
}
export declare class FilterKeysDto {
    status?: KeyStatus;
    equipmentName?: string;
    equipmentType?: string;
    issuedFromDate?: string;
    issuedToDate?: string;
    page?: number;
    limit?: number;
}
export declare class KeyManagementResponseDto {
    id: string;
    equipmentName: string;
    equipmentType: string;
    status: KeyStatus;
    issuedToUser?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    booking?: {
        id: string;
        bookingDate: string;
        bookingTime: string;
        duration: number;
    };
    issuedByAdmin?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    issuedAt?: Date;
    returnedByAdmin?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    returnedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class KeyHistoryDto {
    id: string;
    action: 'issued' | 'returned';
    performedBy: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    performedAt: Date;
    notes?: string;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    booking?: {
        id: string;
        bookingDate: string;
        bookingTime: string;
    };
}
