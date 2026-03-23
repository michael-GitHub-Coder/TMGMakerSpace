import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller('test')
export class TestController {
  constructor(private readonly authService: AuthService) {}

  @Post('member-login')
  async testMemberLogin(@Body() loginData: { email: string; password: string }) {
    try {
      const result = await this.authService.validateUser(loginData.email, loginData.password);
      
      if (result) {
        const token = this.authService.generateToken(result);
        return {
          success: true,
          message: 'Member login successful',
          user: result,
          token: token
        };
      } else {
        return {
          success: false,
          message: 'Member login failed - invalid credentials'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Login error',
        error: error.message
      };
    }
  }
}
