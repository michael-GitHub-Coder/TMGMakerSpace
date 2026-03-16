import { Repository } from 'typeorm';
import { KeyManagementEntity } from './entities/key-management.entity';
import { CreateKeyManagementDto, IssueKeyDto, ReturnKeyDto, UpdateKeyManagementDto, FilterKeysDto, KeyManagementResponseDto, KeyHistoryDto } from './dto/key-management.dto';
import { User } from '../users/user.entity';
import { BookingEntity } from '../bookings/booking.entity';
export declare class KeyManagementService {
    private keyRepository;
    private userRepository;
    private bookingRepository;
    constructor(keyRepository: Repository<KeyManagementEntity>, userRepository: Repository<User>, bookingRepository: Repository<BookingEntity>);
    createKey(createKeyDto: CreateKeyManagementDto): Promise<KeyManagementResponseDto>;
    getAllKeys(filterDto: FilterKeysDto): Promise<{
        keys: KeyManagementResponseDto[];
        total: number;
    }>;
    getKeyById(id: string): Promise<KeyManagementResponseDto>;
    updateKey(id: string, updateKeyDto: UpdateKeyManagementDto): Promise<KeyManagementResponseDto>;
    deleteKey(id: string): Promise<void>;
    issueKey(id: string, issueKeyDto: IssueKeyDto, adminId: number): Promise<KeyManagementResponseDto>;
    returnKey(id: string, returnKeyDto: ReturnKeyDto, adminId: number): Promise<KeyManagementResponseDto>;
    getKeyHistory(id: string): Promise<KeyHistoryDto[]>;
    getKeysByUserId(userId: number): Promise<KeyManagementResponseDto[]>;
    getOverdueKeys(): Promise<KeyManagementResponseDto[]>;
    private formatKeyResponse;
}
