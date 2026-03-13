import { User } from '../../users/user.entity';
import { BookingEntity } from '../../bookings/booking.entity';
export declare enum KeyStatus {
    AVAILABLE = "available",
    ISSUED = "issued",
    RETURNED = "returned"
}
export declare class KeyManagementEntity {
    id: string;
    equipmentName: string;
    equipmentType: string;
    status: KeyStatus;
    issuedToUserId: number;
    issuedToUser: User;
    bookingId: string;
    booking: BookingEntity;
    issuedByAdminId: number;
    issuedByAdmin: User;
    issuedAt: Date;
    returnedByAdminId: number;
    returnedByAdmin: User;
    returnedAt: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
