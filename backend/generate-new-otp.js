const { Pool } = require('pg');
const crypto = require('crypto');

async function generateNewOTP() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== GENERATING NEW OTP FOR TESTING ===');
    
    // Generate new OTP (8-digit number)
    const newOTP = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log('🔑 Generated OTP:', newOTP);
    
    // Update membership application with new OTP
    const updateQuery = `
      UPDATE "membership_applications" 
      SET "oneTimePassword" = $1
      WHERE "email" = $2
    `;
    
    await pool.query(updateQuery, [newOTP, 'ntokozomahlaela@gmail.com']);
    
    console.log('✅ OTP updated in database for ntokozomahlaela@gmail.com');
    console.log('📧 Member can now use this OTP to login');
    console.log('🔑 Test OTP:', newOTP);
    
  } catch (error) {
    console.error('❌ Error generating new OTP:', error);
  } finally {
    await pool.end();
  }
}

generateNewOTP();
