const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { getRepository } = require('typeorm');

async function removeMember() {
  const app = await NestFactory.create(AppModule);
  
  // Get repositories
  const userRepository = getRepository('User');
  const membershipRepository = getRepository('MembershipApplicationEntity');
  
  const emailToRemove = 'Ntokozomahlaela@gmail.com';
  
  try {
    console.log(`🔍 Looking for member: ${emailToRemove}`);
    
    // Find and remove membership applications
    const membershipApps = await membershipRepository.find({ 
      where: { email: emailToRemove } 
    });
    
    if (membershipApps.length > 0) {
      console.log(`📋 Found ${membershipApps.length} membership application(s)`);
      await membershipRepository.remove(membershipApps);
      console.log(`✅ Removed membership applications`);
    }
    
    // Find and remove user
    const user = await userRepository.findOne({ 
      where: { email: emailToRemove } 
    });
    
    if (user) {
      console.log(`👤 Found user: ${user.firstName} ${user.lastName} (${user.email})`);
      await userRepository.remove(user);
      console.log(`✅ Removed user from database`);
    } else {
      console.log(`❌ No user found with email: ${emailToRemove}`);
    }
    
    console.log(`🎉 Member removal complete!`);
    
  } catch (error) {
    console.error(`❌ Error removing member:`, error);
  } finally {
    await app.close();
  }
}

removeMember();
