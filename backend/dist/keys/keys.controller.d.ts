import { KeysService } from './keys.service';
import { Key } from './key.entity';
export declare class KeysController {
    private readonly keysService;
    constructor(keysService: KeysService);
    findAll(): Promise<Key[]>;
    getStatistics(): Promise<any>;
    findOne(id: string): Promise<Key>;
    issueKey(id: string, issueRequest: {
        issuedBy: string;
        memberName: string;
        memberEmail: string;
        memberPhone: string;
        bookingDateTime: string;
        notes?: string;
    }): Promise<Key>;
    returnKey(id: string, returnedBy: string): Promise<Key>;
    getKeysByStatus(status: 'available' | 'issued' | 'returned'): Promise<Key[]>;
    getKeysByEquipment(equipmentName: string): Promise<Key[]>;
    getKeysByMember(memberName: string): Promise<Key[]>;
    createKey(keyData: Partial<Key>): Promise<Key>;
}
