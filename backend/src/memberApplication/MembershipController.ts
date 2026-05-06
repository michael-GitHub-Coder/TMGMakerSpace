import { Controller, Post, Put, Get, Patch, Param, Body, UploadedFiles, UseInterceptors, UsePipes, Req } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MembershipService } from './Membership.Service';
import { CreateMembershipDto, UpdateMembershipDto } from './DTO/membership.dto';
import { extname } from 'path';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('apply')
  @UseInterceptors(
    FilesInterceptor('documents', 5, {
      storage: diskStorage({
        destination: './uploads', 
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async apply(@Req() req: any, @UploadedFiles() files: Express.Multer.File[]) {
    try {
      console.log('=== APPLICATION SUBMISSION DEBUG ===');
      console.log('Received files:', files);
      console.log('Received body:', req.body);
      
      const filePaths = files ? files.map(file => file.path) : [];
      
      // Manual validation and DTO creation
      if (!req.body.name || !req.body.surname || !req.body.email || !req.body.phone) {
        throw new Error('Missing required fields: name, surname, email, phone');
      }
      
      const dto: CreateMembershipDto = {
        name: String(req.body.name).trim(),
        surname: String(req.body.surname).trim(),
        email: String(req.body.email).trim().toLowerCase(),
        phone: String(req.body.phone).trim(),
        documents: filePaths,
      };
      
      console.log('Created DTO:', dto);
      const result = await this.membershipService.apply(dto);
      console.log('Application saved successfully:', result);
      return result;
      
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    }
  }


  @Get('applications')
  getAllApplications() {
    return this.membershipService.getAllApplications();
  }

  @Put('applications/:id/approve')
  approveApplication(@Param('id') id: number) {
    return this.membershipService.approveApplication(id);
  }

  @Put('applications/:id/reject')
  rejectApplication(
    @Param('id') id: number,
    @Body('reason') reason: string,
  ) {
    return this.membershipService.rejectApplication(id, reason);
  }


  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.membershipService.findOne(id);
  }

  @Patch(':id')
  adminUpdate(@Param('id') id: number, @Body() dto: UpdateMembershipDto) {
    return this.membershipService.adminUpdate(id, dto);
  }
}
