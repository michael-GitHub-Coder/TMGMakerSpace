import { User } from '../users/user.entity';
import { Equipment } from './equipment.entity';
import { KeyHistory } from './key-history.entity';
export declare class Key {
    id: string;
    equipment: Equipment;
    equipmentId: string;
    status: 'available' | 'issued' | 'returned';
    currentHolder: User;
    currentHolderId: string | null;
    issuedBy: User;
    issuedById: string;
    issuedAt: Date;
    returnedAt: Date;
    returnedBy: User;
    returnedById: string;
    history: KeyHistory[];
    createdAt: Date;
    updatedAt: Date;
}
