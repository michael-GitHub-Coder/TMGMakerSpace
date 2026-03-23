import { Repository } from 'typeorm';
import { KeyEntity, Key } from './key.entity';
import { KeyNotificationService } from './key-notification.service';
export declare class KeysService {
    private readonly keyRepository;
    private readonly keyNotificationService;
    constructor(keyRepository: Repository<KeyEntity>, keyNotificationService: KeyNotificationService);
    findAll(): Promise<Key[]>;
    findOne(id: string): Promise<Key | null>;
    create(keyData: Partial<Key>): Promise<Key>;
    update(id: string, updateData: Partial<Key>): Promise<Key>;
    private scheduleReturnReminder;
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
