export declare class CreateBookingDto {
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
}
export declare class UpdateBookingDto {
    status?: 'pending' | 'confirmed' | 'cancelled';
    bookingDate?: string;
    bookingTime?: string;
    duration?: number;
    machineType?: string;
}
