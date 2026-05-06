const { createConnection } = require('typeorm');
const { User } = require('./dist/users/user.entity');
const { MembershipApplicationEntity } = require('./dist/memberApplication/MembershipApplication.Entity');

async function searchUser() {
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

    const emailToSearch = 'Ntokozomahlaela@gmail.com';
    
    // Get repositories
    const userRepository = connection.getRepository(User);
    const membershipRepository = connection.getRepository(MembershipApplicationEntity);
    
    console.log(`🔍 Searching for: ${emailToSearch}`);
    console.log('\n=== USER TABLE ===');
    
    // Search user table with partial match
    const users = await userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :email', { email: `%${emailToSearch}%` })
      .orWhere('user.email ILIKE :email', { email: `%ntokozomahlaela%` })
      .getMany();
    
    if (users.length > 0) {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: "${user.email}", Name: ${user.firstName} ${user.lastName}, Role: ${user.role}`);
      });
    } else {
      console.log('❌ No users found');
    }
    
    console.log('\n=== MEMBERSHIP APPLICATIONS TABLE ===');
    
    // Search membership applications with partial match
    const applications = await membershipRepository
      .createQueryBuilder('app')
      .where('app.email ILIKE :email', { email: `%${emailToSearch}%` })
      .orWhere('app.email ILIKE :email', { email: `%ntokozomahlaela%` })
      .getMany();
    
    if (applications.length > 0) {
      console.log(`✅ Found ${applications.length} application(s):`);
      applications.forEach(app => {
        console.log(`   - ID: ${app.id}, Email: "${app.email}", Name: ${app.name} ${app.surname}, Status: ${app.status}`);
      });
    } else {
      console.log('❌ No membership applications found');
    }
    
    console.log('\n=== SEARCHING FOR SIMILAR EMAILS ===');
    
    // Search for any emails containing 'ntokozomahlaela'
    const similarUsers = await userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :search', { search: '%ntokozomahlaela%' })
      .getMany();
    
    const similarApplications = await membershipRepository
      .createQueryBuilder('app')
      .where('app.email ILIKE :search', { search: '%ntokozomahlaela%' })
      .getMany();
    
    if (similarUsers.length > 0 || similarApplications.length > 0) {
      console.log('✅ Found similar entries:');
      similarUsers.forEach(user => {
        console.log(`   USER - ID: ${user.id}, Email: "${user.email}"`);
      });
      similarApplications.forEach(app => {
        console.log(`   APP - ID: ${app.id}, Email: "${app.email}"`);
      });
    } else {
      console.log('❌ No similar entries found');
    }
    
    await connection.close();
    console.log('\n🔌 Database connection closed');
  } catch (error) {
    console.error(`❌ Error searching:`, error);
  }
}

searchUser();
