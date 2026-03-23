export declare class KeyEntity {
    id: string;
    equipmentName: string;
    memberName: string;
    memberEmail?: string;
    memberPhone?: string;
    bookingDateTime: string;
    keyStatus: 'available' | 'issued' | 'returned';
    issuedBy?: string;
    issuedDateTime?: string;
    returnedDateTime?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Key {
    id: string;
    equipmentName: string;
    memberName: string;
    memberEmail?: string;
    memberPhone?: string;
    bookingDateTime: string;
    keyStatus: 'available' | 'issued' | 'returned';
    issuedBy?: string;
    issuedDateTime?: string;
    returnedDateTime?: string;
    createdAt: Date;
    updatedAt: Date;
}
