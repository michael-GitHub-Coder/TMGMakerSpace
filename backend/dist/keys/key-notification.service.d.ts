import { ConfigService } from '@nestjs/config';
export interface KeyIssuedEmailData {
    memberName: string;
    memberEmail: string;
    memberPhone: string;
    equipmentName: string;
    issuedBy: string;
    issuedDateTime: string;
}
export interface KeyReturnReminderData {
    memberName: string;
    memberEmail: string;
    equipmentName: string;
    issuedBy: string;
    issuedDateTime: string;
}
export interface KeyReturnedConfirmationData {
    memberName: string;
    memberEmail: string;
    equipmentName: string;
    issuedBy: string;
    issuedDateTime: string;
    returnedDateTime: string;
}
export declare class KeyNotificationService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendKeyIssuedNotification(data: KeyIssuedEmailData): Promise<void>;
    sendKeyReturnReminder(data: KeyReturnReminderData): Promise<void>;
    sendKeyReturnedConfirmation(data: KeyReturnedConfirmationData): Promise<void>;
}
