import { Key } from './key.entity';
import { User } from '../users/user.entity';
export declare class KeyHistory {
    id: string;
    key: Key;
    keyId: string;
    action: 'issued' | 'returned';
    member: User;
    memberId: string;
    admin: User;
    adminId: string;
    actionDate: Date;
    notes: string;
    createdAt: Date;
}
