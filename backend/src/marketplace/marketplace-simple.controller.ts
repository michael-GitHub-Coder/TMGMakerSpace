import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { MarketplaceService } from './marketplace.service.js';
import { CreateMarketplaceItemDto } from './dto/create-marketplace-item.dto.js';
import { EnquiryDto } from './dto/enquiry.dto.js';
import { MarketplaceItem } from './entities/marketplace-item.entity.js';

@Controller('api/marketplace')
export class MarketplaceSimpleController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('items')
  async getAllMarketplaceItems(): Promise<MarketplaceItem[]> {
    return await this.marketplaceService.getAllMarketplaceItems();
  }

  @Get('items/member/:email')
  async getMarketplaceItemsByMember(@Param('email') email: string): Promise<MarketplaceItem[]> {
    return await this.marketplaceService.getMarketplaceItemsByMember(email);
  }

  @Post('items')
  async createMarketplaceItem(
    @Body() createMarketplaceItemDto: CreateMarketplaceItemDto,
  ): Promise<MarketplaceItem> {
    return await this.marketplaceService.createMarketplaceItem(createMarketplaceItemDto);
  }

  @Get('items/:id')
  async getMarketplaceItemById(@Param('id') id: string): Promise<MarketplaceItem> {
    const item = await this.marketplaceService.getMarketplaceItemById(id);
    if (!item) {
      throw new Error('Marketplace item not found');
    }
    return item;
  }

  @Put('items/:id')
  async updateMarketplaceItem(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateMarketplaceItemDto>,
  ): Promise<MarketplaceItem> {
    console.log('🚀 BACKEND: 🔄 MARKETPLACE UPDATE REQUEST RECEIVED');
    console.log('🚀 BACKEND: 🆔 Item ID:', id);
    console.log('🚀 BACKEND: 📦 Update data:', updateData);
    
    try {
      const result = await this.marketplaceService.updateMarketplaceItem(id, updateData);
      console.log('🚀 BACKEND: ✅ UPDATE SUCCESS:', result);
      return result;
    } catch (error) {
      console.error('🚀 BACKEND: ❌ UPDATE ERROR:', error);
      throw error;
    }
  }

  @Delete('items/:id')
  async deleteMarketplaceItem(@Param('id') id: string): Promise<void> {
    await this.marketplaceService.deleteMarketplaceItem(id);
  }

  @Post('enquiry')
  async sendEnquiry(@Body() enquiryDto: EnquiryDto): Promise<{ message: string }> {
    await this.marketplaceService.sendEnquiry(enquiryDto);
    return { message: 'Enquiry sent successfully' };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Create uploads/marketplace directory if it doesn't exist
          const uploadPath = join(process.cwd(), 'uploads', 'marketplace');
          console.log('🚀 BACKEND: 📁 Upload path:', uploadPath);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate unique filename
          const randomSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const filename = `${file.fieldname}-${randomSuffix}${extname(file.originalname)}`;
          console.log('🚀 BACKEND: 📝 Generated filename:', filename);
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log('🚀 BACKEND: 🔍 File filter checking:', file.originalname);
        // Only allow image files
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          console.log('🚀 BACKEND: ❌ Invalid file type:', file.originalname);
          return cb(new Error('Only image files are allowed!'), false);
        }
        console.log('🚀 BACKEND: ✅ Valid file type:', file.originalname);
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    })
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      })
    )
    file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    console.log('🚀 BACKEND: 📸 Upload endpoint called!');
    console.log('🚀 BACKEND: 📸 File received:', {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path
    });
    
    // Return the relative path to the uploaded file
    const imageUrl = `uploads/marketplace/${file.filename}`;
    console.log('🚀 BACKEND: 🖼️ Image URL:', imageUrl);
    console.log('🚀 BACKEND: 📁 Full file path:', file.path);
    
    return { imageUrl };
  }
}
