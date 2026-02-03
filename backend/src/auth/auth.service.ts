import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './DTO/ChangePasswordDto';

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, 
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: pwd, ...result } = user;
    return result;
  }

  // Create JWT token
  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  // async login(loginDto: LoginDto) {
  //   const user = await this.validateUser(loginDto.email, loginDto.password);
  //   if (!user) throw new UnauthorizedException('Invalid credentials');

  //   const token = this.generateToken(user);

  //   return {
  //     status: 'success',
  //     message: 'Login successful',
  //     token, 
  //     data: { user },
  //   };
  // }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.mustChangePassword) {
      return {
        status: 'pending',
        message: 'Password change required',
        data: { userId: user.id, email: user.email },
      };
    }

    const token = this.generateToken(user);
    return {
      status: 'success',
      message: 'Login successful',
      token,
      data: { user },
    };
  }


  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) throw new UnauthorizedException('User already exists');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role, 
    });

    const { password, ...result } = user;
    const token = this.generateToken(result);

    return {
      status: 'success',
      message: 'Registration successful',
      token, 
      data: { user: result },
    };
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.usersService.findById(dto.userId);
    if (!user) throw new UnauthorizedException('User not found');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.mustChangePassword = false;

    await this.usersService.update(user.id, user);

    const token = this.generateToken(user);
    return {
      status: 'success',
      message: 'Password changed successfully',
      token,
      data: { user },
    };
  }


}
