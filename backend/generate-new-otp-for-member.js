const { Pool } = require('pg');
const crypto = require('crypto');

async function generateNewOTPForMember() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== GENERATING NEW OTP FOR MEMBER ===');
    
    // Generate new OTP (8-digit number)
    const newOTP = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log('🔑 Generated New OTP:', newOTP);
    
    // Update membership application with new OTP
    const updateQuery = `
      UPDATE "membership_applications" 
      SET "oneTimePassword" = $1
      WHERE "email" = $2
    `;
    
    await pool.query(updateQuery, [newOTP, 'ntokozomahlaela@gmail.com']);
    
    console.log('✅ New OTP updated in database for ntokozomahlaela@gmail.com');
    console.log('📧 Member can now use this new OTP to login');
    console.log('🔑 New OTP:', newOTP);
    
    // Also update user password to match the new OTP for first-time login
    const bcrypt = require('bcrypt');
    const hashedOTP = await bcrypt.hash(newOTP, 10);
    
    const updateUserQuery = `
      UPDATE "user" 
      SET "password" = $1, "mustChangePassword" = true
      WHERE "email" = $2
    `;
    
    await pool.query(updateUserQuery, [hashedOTP, 'ntokozomahlaela@gmail.com']);
    
    console.log('✅ User password updated to match new OTP');
    console.log('🔐 Member can now login with new OTP and will be forced to change password');
    
  } catch (error) {
    console.error('❌ Error generating new OTP:', error);
  } finally {
    await pool.end();
  }
}

generateNewOTPForMember();
