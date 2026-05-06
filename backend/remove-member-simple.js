const { createConnection } = require('typeorm');
const { User } = require('./dist/users/user.entity');
const { MembershipApplicationEntity } = require('./dist/memberApplication/MembershipApplication.Entity');

async function removeMember() {
  try {
    // Create database connection
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Ntokz@084',
      database: 'TMGMakerSpace',
      entities: [User, MembershipApplicationEntity],
      synchronize: false,
      logging: false
    });

    console.log('🔍 Connected to database');

    const emailToRemove = 'Ntokozomahlaela@gmail.com';
    
    // Get repositories
    const userRepository = connection.getRepository(User);
    const membershipRepository = connection.getRepository(MembershipApplicationEntity);
    
    console.log(`🔍 Looking for member: ${emailToRemove}`);
    
    // Find and remove membership applications
    const membershipApps = await membershipRepository.find({ 
      where: { email: emailToRemove } 
    });
    
    if (membershipApps.length > 0) {
      console.log(`📋 Found ${membershipApps.length} membership application(s)`);
      for (const app of membershipApps) {
        console.log(`   - ID: ${app.id}, Name: ${app.name} ${app.surname}, Status: ${app.status}`);
      }
      await membershipRepository.remove(membershipApps);
      console.log(`✅ Removed membership applications`);
    } else {
      console.log(`❌ No membership applications found for: ${emailToRemove}`);
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
    
    await connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error(`❌ Error removing member:`, error);
  }
}

removeMember();
