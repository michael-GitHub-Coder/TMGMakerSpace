import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { KeyEntity, Key } from './key.entity';
import { Inject } from '@nestjs/common';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(KeyEntity)
    private readonly keyRepository: Repository<KeyEntity>,
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
    await this.keyRepository.update(id, updateData);
    const updatedKey = await this.findOne(id);
    if (!updatedKey) {
      throw new Error('Key not found after update');
    }
    return updatedKey;
  }

  async issueKey(id: string, issueRequest: { issuedBy: string; memberName: string; memberEmail: string; memberPhone: string; bookingDateTime: string; notes?: string }): Promise<Key> {
    const key = await this.findOne(id);
    
    if (!key) {
      throw new Error('Key not found');
    }

    if (key.keyStatus !== 'available') {
      throw new Error('Key is already issued or returned');
    }

    const updateData: Partial<Key> = {
      keyStatus: 'issued',
      memberName: issueRequest.memberName,
      issuedBy: issueRequest.issuedBy,
      issuedDateTime: new Date().toISOString()
    };

    return this.update(id, updateData);
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
      issuedBy: undefined,
      issuedDateTime: undefined,
      returnedDateTime: undefined
    };

    return this.update(id, updateData);
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
