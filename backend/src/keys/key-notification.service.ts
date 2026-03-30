import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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

@Injectable()
export class KeyNotificationService {
  private readonly logger = new Logger(KeyNotificationService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get<string>('EMAIL_PORT') || '465'),
      secure: true, // Use SSL for port 465
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendKeyIssuedNotification(data: KeyIssuedEmailData): Promise<void> {
    const subject = `Key Issued: ${data.equipmentName} - TMG Makerspace`;
    
    const emailContent = `
      Dear ${data.memberName},
      
      You have been issued a key for the following equipment at TMG Makerspace:
      
      📋 Equipment Details:
      • Equipment: ${data.equipmentName}
      • Issued by: ${data.issuedBy}
      • Date & Time: ${data.issuedDateTime}
      • Contact Email: ${data.memberEmail}
      • Contact Phone: ${data.memberPhone}
      
      ⚠️ Important Information:
      • Please return the key promptly after use 
      • You will receive a reminder email if the key is not returned within 30 minutes
      • Handle the equipment with care
      
      📍 Pick up Location: TMG Makerspace Admin Desk
      📞 For assistance: Contact TMG Makerspace staff
      
      Thank you for using TMG Makerspace facilities!
      
      Best regards,
      TMG Makerspace Team
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
        to: data.memberEmail,
        subject: subject,
        html: emailContent.replace(/\n/g, '<br>'),
      });
      
      this.logger.log(`[EMAIL NOTIFICATION] Key issued notification sent to ${data.memberEmail}`);
    } catch (error) {
      this.logger.error(`[EMAIL NOTIFICATION] Failed to send key issued notification:`, error);
      throw new Error(`Failed to send email notification: ${error.message}`);
    }
  }

  async sendKeyReturnReminder(data: KeyReturnReminderData): Promise<void> {
    const subject = `⏰ Reminder: Return Key for ${data.equipmentName} - TMG Makerspace`;
    
    const emailContent = `
      Dear ${data.memberName},
      
      ⏰ REMINDER: Its almost time to return the key for ${data.equipmentName}. Please return it soon.
      
      📋 Issuance Details:
      • Equipment: ${data.equipmentName}
      • Issued by: ${data.issuedBy}
      • Issued at: ${data.issuedDateTime}
      
      🔑 Please return the key to:
      • TMG Makerspace Admin Desk
      • During operating hours
      
      ⚠️ Important:
      • Other members may be waiting for this equipment
      • Prompt return helps everyone access equipment fairly
      • Your cooperation is appreciated
      
      📞 Questions? Contact TMG Makerspace staff
      
      Thank you for your prompt attention to this matter.
      
      Best regards,
      TMG Makerspace Team
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
        to: data.memberEmail,
        subject: subject,
        html: emailContent.replace(/\n/g, '<br>'),
      });
      
      this.logger.log(`[EMAIL NOTIFICATION] Key return reminder sent to ${data.memberEmail}`);
    } catch (error) {
      this.logger.error(`[EMAIL NOTIFICATION] Failed to send key return reminder:`, error);
      throw new Error(`Failed to send reminder email: ${error.message}`);
    }
  }

  async sendKeyReturnedConfirmation(data: KeyReturnedConfirmationData): Promise<void> {
    const subject = `Key Returned Confirmation: ${data.equipmentName} - TMG Makerspace`;
    
    const emailContent = `
      Dear ${data.memberName},
      
      ✅ Thank you for returning the key for ${data.equipmentName}!
      
      📋 Return Details:
      • Equipment: ${data.equipmentName}
      • Originally issued by: ${data.issuedBy}
      • Issued at: ${data.issuedDateTime}
      • Returned at: ${data.returnedDateTime}
      
      🙏 Appreciation:
      • Thank you for your prompt return
      • Your cooperation helps other members access equipment
      • We appreciate you following TMG Makerspace policies
      
      🌟 We hope you had a productive session with the equipment!
      
      📞 Need anything else? Contact TMG Makerspace staff
      
      We look forward to seeing you again at TMG Makerspace.
      
      Best regards,
      TMG Makerspace Team.
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"TMG Makerspace" <noreply@tmgmakerspace.com>',
        to: data.memberEmail,
        subject: subject,
        html: emailContent.replace(/\n/g, '<br>'),
      });
      
      this.logger.log(`[EMAIL NOTIFICATION] Key returned confirmation sent to ${data.memberEmail}`);
    } catch (error) {
      this.logger.error(`[EMAIL NOTIFICATION] Failed to send key returned confirmation:`, error);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }
  }
}
