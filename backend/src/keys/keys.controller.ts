import { Controller, Get, Post, Body, Param, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { KeysService } from './keys.service';
import { Key } from './key.entity';

@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Get()
  async findAll(): Promise<Key[]> {
    return this.keysService.findAll();
  }

  @Get('statistics')
  async getStatistics() {
    return this.keysService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Key> {
    const key = await this.keysService.findOne(id);
    if (!key) {
      throw new HttpException('Key not found', HttpStatus.NOT_FOUND);
    }
    return key;
  }

  @Post(':id/issue')
  async issueKey(
    @Param('id') id: string,
    @Body() issueRequest: { issuedBy: string; memberName: string; memberEmail: string; memberPhone: string; bookingDateTime: string; notes?: string }
  ): Promise<Key> {
    console.log(`[CONTROLLER] Received key issuance request for key ID: ${id}`);
    console.log(`[CONTROLLER] Request body:`, issueRequest);
    
    try {
      const result = await this.keysService.issueKey(id, issueRequest);
      console.log(`[CONTROLLER] Key issuance successful for key ${id}`);
      return result;
    } catch (error) {
      console.error(`[CONTROLLER] Key issuance failed for key ${id}:`, error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/return')
  async returnKey(
    @Param('id') id: string,
    @Body('returnedBy') returnedBy: string
  ): Promise<Key> {
    try {
      return await this.keysService.returnKey(id, returnedBy);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('status/:status')
  async getKeysByStatus(@Param('status') status: 'available' | 'issued' | 'returned'): Promise<Key[]> {
    return this.keysService.getKeysByStatus(status);
  }

  @Get('equipment/:equipmentName')
  async getKeysByEquipment(@Param('equipmentName') equipmentName: string): Promise<Key[]> {
    return this.keysService.getKeysByEquipment(equipmentName);
  }

  @Get('member/:memberName')
  async getKeysByMember(@Param('memberName') memberName: string): Promise<Key[]> {
    return this.keysService.getKeysByMember(memberName);
  }

  @Post()
  async createKey(@Body() keyData: Partial<Key>): Promise<Key> {
    try {
      return await this.keysService.create(keyData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
