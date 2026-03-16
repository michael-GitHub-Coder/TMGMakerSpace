import { KeyManagementService } from './key-management.service';
import { CreateKeyManagementDto, IssueKeyDto, ReturnKeyDto, UpdateKeyManagementDto, FilterKeysDto, KeyManagementResponseDto, KeyHistoryDto } from './dto/key-management.dto';
export declare class KeyManagementController {
    private readonly keyManagementService;
    constructor(keyManagementService: KeyManagementService);
    createKey(createKeyDto: CreateKeyManagementDto): Promise<KeyManagementResponseDto>;
    getAllKeys(filterDto: FilterKeysDto): Promise<{
        keys: KeyManagementResponseDto[];
        total: number;
    }>;
    getMyKeys(req: any): Promise<KeyManagementResponseDto[]>;
    getOverdueKeys(): Promise<KeyManagementResponseDto[]>;
    getKeyById(id: string): Promise<KeyManagementResponseDto>;
    getKeyHistory(id: string): Promise<KeyHistoryDto[]>;
    updateKey(id: string, updateKeyDto: UpdateKeyManagementDto): Promise<KeyManagementResponseDto>;
    issueKey(id: string, issueKeyDto: IssueKeyDto, req: any): Promise<KeyManagementResponseDto>;
    returnKey(id: string, returnKeyDto: ReturnKeyDto, req: any): Promise<KeyManagementResponseDto>;
    deleteKey(id: string): Promise<void>;
}
