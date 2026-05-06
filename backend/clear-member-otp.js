const { Pool } = require('pg');

async function clearMemberOTP() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== CLEARING MEMBER OTP ===');
    
    // Clear the OTP from membership application
    const updateQuery = `
      UPDATE "membership_applications" 
      SET "oneTimePassword" = NULL
      WHERE "email" = $1
    `;
    
    await pool.query(updateQuery, ['ntokozomahlaela@gmail.com']);
    
    console.log('✅ OTP cleared from membership application for ntokozomahlaela@gmail.com');
    console.log('🔑 Member can now login with regular password only');
    
  } catch (error) {
    console.error('❌ Error clearing member OTP:', error);
  } finally {
    await pool.end();
  }
}

clearMemberOTP();
