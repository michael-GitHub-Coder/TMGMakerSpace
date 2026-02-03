import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  newPassword: string;
}
