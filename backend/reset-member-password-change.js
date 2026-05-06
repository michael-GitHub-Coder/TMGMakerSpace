const { Pool } = require('pg');

async function resetMemberPasswordChange() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== RESETTING MEMBER PASSWORD CHANGE ===');
    
    // Set mustChangePassword back to true so they can use OTP
    const updateQuery = `
      UPDATE "user" 
      SET "mustChangePassword" = true
      WHERE "email" = $1
    `;
    
    await pool.query(updateQuery, ['ntokozomahlaela@gmail.com']);
    
    console.log('✅ Must change password set to true for ntokozomahlaela@gmail.com');
    console.log('🔑 Member can now login with OTP for first time');
    console.log('📧 After OTP login, they can set their own password');
    
  } catch (error) {
    console.error('❌ Error resetting member password change:', error);
  } finally {
    await pool.end();
  }
}

resetMemberPasswordChange();
