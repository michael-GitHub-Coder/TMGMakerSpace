import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userRepository = getRepository(User);
    
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@tmgmakerspace.com' } 
    });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const adminUser = userRepository.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@tmgmakerspace.com',
      password: hashedPassword,
      role: 'superadmin',
      mustChangePassword: false
    });
    
    // Save to database
    await userRepository.save(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@tmgmakerspace.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: superadmin');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await app.close();
  }
}

createAdmin();
