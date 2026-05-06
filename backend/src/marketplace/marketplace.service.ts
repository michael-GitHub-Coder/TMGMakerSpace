import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceItem } from './entities/marketplace-item.entity.js';
import { CreateMarketplaceItemDto } from './dto/create-marketplace-item.dto.js';
import { EnquiryDto } from './dto/enquiry.dto.js';
import { EmailMarketplaceService } from '../email/email-marketplace.service.js';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketplaceItem)
    private marketplaceRepository: Repository<MarketplaceItem>,
    private emailService: EmailMarketplaceService,
  ) {}

  async createMarketplaceItem(createMarketplaceItemDto: CreateMarketplaceItemDto): Promise<MarketplaceItem> {
    const newItem = this.marketplaceRepository.create(createMarketplaceItemDto);
    return await this.marketplaceRepository.save(newItem);
  }

  async getAllMarketplaceItems(): Promise<MarketplaceItem[]> {
    return await this.marketplaceRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async getMarketplaceItemsByMember(memberEmail: string): Promise<MarketplaceItem[]> {
    return await this.marketplaceRepository.find({
      where: { memberEmail },
      order: { createdAt: 'DESC' }
    });
  }

  async getMarketplaceItemById(id: string): Promise<MarketplaceItem | null> {
    return await this.marketplaceRepository.findOne({ where: { id } });
  }

  async updateMarketplaceItem(id: string, updateData: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    console.log('🚀 BACKEND SERVICE: 🔄 UPDATING MARKETPLACE ITEM');
    console.log('🚀 BACKEND SERVICE: 🆔 Item ID:', id);
    console.log('🚀 BACKEND SERVICE: 📦 Update data:', updateData);
    
    try {
      // First check if item exists
      const existingItem = await this.getMarketplaceItemById(id);
      if (!existingItem) {
        console.error('🚀 BACKEND SERVICE: ❌ ITEM NOT FOUND:', id);
        throw new Error('Marketplace item not found');
      }
      
      console.log('🚀 BACKEND SERVICE: 📋 Existing item:', existingItem);
      
      // Update the item
      const updateResult = await this.marketplaceRepository.update(id, updateData);
      console.log('🚀 BACKEND SERVICE: ✅ Database update result:', updateResult);
      
      // Get the updated item
      const updatedItem = await this.getMarketplaceItemById(id);
      console.log('🚀 BACKEND SERVICE: ✅ Updated item:', updatedItem);
      
      if (!updatedItem) {
        console.error('🚀 BACKEND SERVICE: ❌ UPDATED ITEM NOT FOUND AFTER UPDATE');
        throw new Error('Marketplace item not found after update');
      }
      
      return updatedItem;
    } catch (error) {
      console.error('🚀 BACKEND SERVICE: ❌ UPDATE ERROR:', error);
      throw error;
    }
  }

  async deleteMarketplaceItem(id: string): Promise<void> {
    await this.marketplaceRepository.delete(id);
  }

  async sendEnquiry(enquiryDto: EnquiryDto): Promise<void> {
    const subject = `Marketplace Enquiry: ${enquiryDto.itemName}`;
    const htmlContent = `
      <h2>New Marketplace Enquiry</h2>
      <p><strong>Item:</strong> ${enquiryDto.itemName}</p>
      <p><strong>From:</strong> ${enquiryDto.user_name} (${enquiryDto.user_email})</p>
      ${enquiryDto.user_phone ? `<p><strong>Phone:</strong> ${enquiryDto.user_phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${enquiryDto.enquiryMessage}</p>
      <hr>
      <p><em>This enquiry was sent via the TMG Makerspace Marketplace</em></p>
    `;

    await this.emailService.sendMail(
      enquiryDto.memberEmail,
      subject,
      htmlContent
    );
  }
}
