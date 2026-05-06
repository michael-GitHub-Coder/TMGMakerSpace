const { createConnection } = require('typeorm');
const { User } = require('./dist/users/user.entity');
const { MembershipApplicationEntity } = require('./dist/memberApplication/MembershipApplication.Entity');

async function removeAllEntries() {
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

    const emailPattern = '%ntokozomahlaela%';
    
    // Get repositories
    const userRepository = connection.getRepository(User);
    const membershipRepository = connection.getRepository(MembershipApplicationEntity);
    
    console.log(`🔍 Removing all entries matching: ${emailPattern}`);
    
    // Find and remove all users with matching email
    const users = await userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :email', { email: emailPattern })
      .getMany();
    
    if (users.length > 0) {
      console.log(`\n📋 Found ${users.length} user(s) to remove:`);
      users.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: "${user.email}", Name: ${user.firstName} ${user.lastName}, Role: ${user.role}`);
      });
      
      await userRepository.remove(users);
      console.log(`✅ Removed ${users.length} user(s) from database`);
    } else {
      console.log('❌ No users found to remove');
    }
    
    // Find and remove all membership applications with matching email
    const applications = await membershipRepository
      .createQueryBuilder('app')
      .where('app.email ILIKE :email', { email: emailPattern })
      .getMany();
    
    if (applications.length > 0) {
      console.log(`\n📋 Found ${applications.length} membership application(s) to remove:`);
      applications.forEach(app => {
        console.log(`   - ID: ${app.id}, Email: "${app.email}", Name: ${app.name} ${app.surname}, Status: ${app.status}`);
      });
      
      await membershipRepository.remove(applications);
      console.log(`✅ Removed ${applications.length} membership application(s) from database`);
    } else {
      console.log('❌ No membership applications found to remove');
    }
    
    console.log('\n🎉 All entries removed successfully!');
    
    await connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error(`❌ Error removing entries:`, error);
  }
}

removeAllEntries();
