import { User } from '../users/user.entity';
export declare class BookingEntity {
    id: string;
    user: User;
    machineType: string;
    pricePerHour: number;
    bookingDate: string;
    bookingTime: string;
    duration: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
