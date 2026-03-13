import { Repository } from 'typeorm';
import { KeyEntity, Key } from './key.entity';
export declare class KeysService {
    private readonly keyRepository;
    constructor(keyRepository: Repository<KeyEntity>);
    findAll(): Promise<Key[]>;
    findOne(id: string): Promise<Key | null>;
    create(keyData: Partial<Key>): Promise<Key>;
    update(id: string, updateData: Partial<Key>): Promise<Key>;
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
    getStatistics(): Promise<any>;
}
