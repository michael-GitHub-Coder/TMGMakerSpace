import { Controller, Post,  Put,  Get, Patch, Param, Body, UploadedFiles, UseInterceptors, Delete } from '@nestjs/common';
import { MembershipAdminService } from './MembershipAdminService';



@Controller('admin/memberships')
export class MembershipAdminController {
  constructor(private readonly service: MembershipAdminService) {}

  @Put(':id/approve')
  approve(@Param('id') id: number) {
    return this.service.approve(id);
  }

  @Put(':id/reject')
  reject(
    @Param('id') id: number,
    @Body('reason') reason: string,
  ) {
    return this.service.reject(id, reason);
  }

  @Put(':id/request-more-info')
  requestMoreInfo(
    @Param('id') id: number,
    @Body('comment') comment: string,
  ) {
    return this.service.requestMoreInfo(id, comment);
  }

  @Get('members')
  getAllMembers() {
    return this.service.getAllMembers();
  }


  @Delete('members/:id')
  deleteMember(@Param('id') id: number) {
    return this.service.deleteMember(id);
  }
}
