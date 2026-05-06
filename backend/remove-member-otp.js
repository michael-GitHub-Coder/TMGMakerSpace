const { Pool } = require('pg');

async function removeMemberOTP() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== REMOVING MEMBER OTP ===');
    
    // Clear the OTP from membership application
    const updateQuery = `
      UPDATE "membership_applications" 
      SET "oneTimePassword" = NULL
      WHERE "email" = $1
    `;
    
    await pool.query(updateQuery, ['ntokozomahlaela@gmail.com']);
    
    console.log('✅ OTP cleared for ntokozomahlaela@gmail.com');
    console.log('🔑 Member can now login with regular password');
    
  } catch (error) {
    console.error('❌ Error removing member OTP:', error);
  } finally {
    await pool.end();
  }
}

removeMemberOTP();
