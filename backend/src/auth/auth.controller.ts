import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto, RegisterDto } from './auth.service';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signUp(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    console.log(`[AUTH] Logout request for user: ${req.user?.email}`);
    
    // In a stateless JWT setup, we don't need to do much server-side
    // The client will handle removing the token
    // If using a token blacklist, we would add it here
    
    return {
      status: 'success',
      message: 'Logout successful',
      data: {
        loggedOutAt: new Date().toISOString()
      }
    };
  }

}
