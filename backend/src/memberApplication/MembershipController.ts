import { Controller, Post,  Put,  Get, Patch, Param, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
  async apply(@UploadedFiles() files: Express.Multer.File[], @Body() body: any) {
    const filePaths = files.map(file => file.path);
    const dto: CreateMembershipDto = {
      ...body,
      documents: filePaths,
    };
    return this.membershipService.apply(dto);
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
