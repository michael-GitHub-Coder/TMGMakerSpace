import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { KeyEntity, Key } from './key.entity';
import { Inject } from '@nestjs/common';
import { KeyNotificationService } from './key-notification.service';

// South African timezone utility
class SouthAfricanDateTime {
  private static readonly SA_TIMEZONE = 'Africa/Johannesburg';
  
  static now(): string {
    const now = new Date();
    // Convert to South African time and format cleanly
    const saTime = new Date(now.toLocaleString("en-US", { timeZone: this.SA_TIMEZONE }));
    return this.formatClean(saTime);
  }
  
  static formatToSAST(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const saTime = new Date(dateObj.toLocaleString("en-US", { timeZone: this.SA_TIMEZONE }));
    return this.formatClean(saTime);
  }
  
  static formatForDisplay(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString("en-ZA", { 
      timeZone: this.SA_TIMEZONE,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  private static formatClean(date: Date): string {
    // Format: YYYY-MM-DD HH:MM (clean format without seconds, milliseconds and timezone)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(KeyEntity)
    private readonly keyRepository: Repository<KeyEntity>,
    private readonly keyNotificationService: KeyNotificationService,
  ) {}

  async findAll(): Promise<Key[]> {
    return this.keyRepository.find({
      order: {
        equipmentName: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Key | null> {
    const key = await this.keyRepository.findOne({ where: { id } });
    return key || null;
  }

  async create(keyData: Partial<Key>): Promise<Key> {
    const newKey = this.keyRepository.create(keyData);
    return this.keyRepository.save(newKey);
  }

  async update(id: string, updateData: Partial<Key>): Promise<Key> {
    console.log(`[KEY SERVICE] Updating key ${id} with data:`, updateData);
    
    try {
      const updateResult = await this.keyRepository.update(id, updateData);
      console.log(`[KEY SERVICE] Database update result:`, updateResult);
      
      const updatedKey = await this.findOne(id);
      if (!updatedKey) {
        console.error(`[KEY SERVICE] Critical error: Key ${id} not found after update`);
        throw new Error('Key not found after update');
      }
      
      console.log(`[KEY SERVICE] Update successful. Updated key:`, updatedKey);
      return updatedKey;
    } catch (error) {
      console.error(`[KEY SERVICE] Database update failed for key ${id}:`, error);
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  // Schedule reminder for key returns (30 minutes after issuance)
  private scheduleReturnReminder(key: Key): void {
    const reminderTime = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    setTimeout(async () => {
      try {
        // Check if key is still issued before sending reminder
        const currentKey = await this.findOne(key.id);
        if (currentKey && currentKey.keyStatus === 'issued') {
          await this.keyNotificationService.sendKeyReturnReminder({
            memberName: currentKey.memberName || 'Unknown',
            memberEmail: currentKey.memberEmail || '',
            equipmentName: currentKey.equipmentName,
            issuedBy: currentKey.issuedBy || 'Unknown',
            issuedDateTime: currentKey.issuedDateTime || ''
          });
          console.log(`[KEY REMINDER] 30-minute reminder sent for key ${key.id}`);
        }
      } catch (error) {
        console.error(`[KEY REMINDER] Failed to send reminder for key ${key.id}:`, error);
      }
    }, reminderTime);
  }

  async issueKey(id: string, issueRequest: { issuedBy: string; memberName: string; memberEmail: string; memberPhone: string; bookingDateTime: string; notes?: string }): Promise<Key> {
    console.log(`[KEY ISSUANCE] Starting key issuance process for key ID: ${id}`);
    console.log(`[KEY ISSUANCE] Issue request data:`, issueRequest);
    
    const key = await this.findOne(id);
    
    if (!key) {
      console.error(`[KEY ISSUANCE] Key with ID ${id} not found in database`);
      throw new Error('Key not found');
    }

    if (key.keyStatus !== 'available') {
      console.error(`[KEY ISSUANCE] Key ${id} is not available. Current status: ${key.keyStatus}`);
      throw new Error('Key is already issued or returned');
    }

    const updateData: Partial<Key> = {
      keyStatus: 'issued',
      memberName: issueRequest.memberName,
      memberEmail: issueRequest.memberEmail,
      memberPhone: issueRequest.memberPhone,
      issuedBy: issueRequest.issuedBy,
      issuedDateTime: SouthAfricanDateTime.now()
    };

    console.log(`[KEY ISSUANCE] Updating key ${id} with data:`, updateData);

    try {
      // Perform the database update
      const updateResult = await this.keyRepository.update(id, updateData);
      console.log(`[KEY ISSUANCE] Database update result:`, updateResult);
      
      // Verify the update was successful by fetching the updated key
      const updatedKey = await this.findOne(id);
      
      if (!updatedKey) {
        console.error(`[KEY ISSUANCE] Critical error: Key ${id} not found after update`);
        throw new Error('Key not found after update - database operation may have failed');
      }

      // Verify all fields were saved correctly
      const verificationData = {
        keyStatus: updatedKey.keyStatus,
        memberName: updatedKey.memberName,
        memberEmail: updatedKey.memberEmail,
        memberPhone: updatedKey.memberPhone,
        issuedBy: updatedKey.issuedBy,
        issuedDateTime: updatedKey.issuedDateTime
      };
      
      console.log(`[KEY ISSUANCE] Verification - Updated key data:`, verificationData);
      
      // Ensure all required fields are present
      if (!updatedKey.memberName || !updatedKey.issuedBy || !updatedKey.issuedDateTime) {
        console.error(`[KEY ISSUANCE] Critical error: Missing required fields after update`, verificationData);
        throw new Error('Key issuance incomplete - missing required data');
      }

      console.log(`[KEY ISSUANCE] SUCCESS: Key ${id} successfully issued to ${issueRequest.memberName}`);
      
      // Send email notification to member
      try {
        await this.keyNotificationService.sendKeyIssuedNotification({
          memberName: issueRequest.memberName,
          memberEmail: issueRequest.memberEmail,
          memberPhone: issueRequest.memberPhone,
          equipmentName: key.equipmentName,
          issuedBy: issueRequest.issuedBy,
          issuedDateTime: SouthAfricanDateTime.now()
        });
        console.log(`[KEY ISSUANCE] Email notification sent to ${issueRequest.memberEmail}`);
        
        // Schedule 30-minute reminder
        this.scheduleReturnReminder(updatedKey);
      } catch (emailError) {
        console.error(`[KEY ISSUANCE] Failed to send email notification:`, emailError);
        // Don't fail the key issuance if email fails
      }
      
      return updatedKey;
      
    } catch (error) {
      console.error(`[KEY ISSUANCE] Database error during key issuance:`, error);
      throw new Error(`Failed to save key issuance to database: ${error.message}`);
    }
  }

  async returnKey(id: string, returnedBy: string): Promise<Key> {
    const key = await this.findOne(id);
    
    if (!key) {
      throw new Error('Key not found');
    }

    if (key.keyStatus !== 'issued') {
      throw new Error('Key is not currently issued');
    }

    const updateData: Partial<Key> = {
      keyStatus: 'available',
      memberName: 'Not Assigned',
      memberEmail: undefined,
      memberPhone: undefined,
      issuedBy: undefined,
      issuedDateTime: undefined,
      returnedDateTime: SouthAfricanDateTime.now()
    };

    try {
      const updatedKey = await this.update(id, updateData);
      
      // Send confirmation email to member
      try {
        await this.keyNotificationService.sendKeyReturnedConfirmation({
          memberName: key.memberName || 'Unknown',
          memberEmail: key.memberEmail || '',
          equipmentName: key.equipmentName,
          issuedBy: key.issuedBy || 'Unknown',
          issuedDateTime: key.issuedDateTime || '',
          returnedDateTime: SouthAfricanDateTime.now()
        });
        console.log(`[KEY RETURN] Confirmation email sent to ${key.memberEmail}`);
      } catch (emailError) {
        console.error(`[KEY RETURN] Failed to send confirmation email:`, emailError);
        // Don't fail the key return if email fails
      }
      
      return updatedKey;
    } catch (error) {
      console.error(`[KEY RETURN] Failed to return key ${id}:`, error);
      throw new Error(`Failed to return key: ${error.message}`);
    }
  }

  async getKeysByStatus(status: 'available' | 'issued' | 'returned'): Promise<Key[]> {
    return this.keyRepository.find({ where: { keyStatus: status } });
  }

  async getKeysByEquipment(equipmentName: string): Promise<Key[]> {
    return this.keyRepository.find({ 
      where: { 
        equipmentName: Like(`%${equipmentName}%`) 
      }
    });
  }

  async getKeysByMember(memberName: string): Promise<Key[]> {
    return this.keyRepository.find({ 
      where: { 
        memberName: Like(`%${memberName}%`) 
      }
    });
  }

  async getStatistics(): Promise<any> {
    const total = await this.keyRepository.count();
    const available = await this.keyRepository.count({ where: { keyStatus: 'available' } });
    const issued = await this.keyRepository.count({ where: { keyStatus: 'issued' } });
    const returned = await this.keyRepository.count({ where: { keyStatus: 'returned' } });

    return {
      total,
      available,
      issued,
      returned
    };
  }
}
