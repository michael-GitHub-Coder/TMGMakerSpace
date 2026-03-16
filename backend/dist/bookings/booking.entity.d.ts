export declare class BookingEntity {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
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
export interface Booking {
    id: string;
    role: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
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
