import { Key } from './key.entity';
import { BookingEntity } from '../bookings/booking.entity';
export declare class Equipment {
    id: string;
    name: string;
    type: string;
    pricePerHour: number;
    status: 'active' | 'maintenance' | 'inactive';
    description: string;
    requiresKey: boolean;
    keys: Key[];
    bookings: BookingEntity[];
    createdAt: Date;
    updatedAt: Date;
}
