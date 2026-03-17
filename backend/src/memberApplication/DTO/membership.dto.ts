// export class CreateMembershipDto {
//   name: string;
//   surname: string;
//   email: string;
//   phone: string;
//   documents: string[]; 
// }

// export class UpdateMembershipDto {
//   status?: 'approved' | 'rejected' | 'more_info_required';
//   adminComment?: string;
// }

import { IsString, IsEmail, IsArray, IsOptional, IsIn } from 'class-validator';

export class CreateMembershipDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @IsOptional()
  documents: string[]; 
}

export class UpdateMembershipDto {
  @IsOptional()
  @IsIn(['approved', 'rejected', 'more_info_required'])
  status?: 'approved' | 'rejected' | 'more_info_required';

  @IsOptional()
  @IsString()
  adminComment?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}