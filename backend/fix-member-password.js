const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function fixMemberPassword() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== FIXING MEMBER PASSWORD ===');
    
    // Hash the new password
    const newPassword = 'Ntokozo1';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('New password hash:', hashedPassword);
    
    // Update the user's password in the database
    const updateQuery = `
      UPDATE "user" 
      SET "password" = $1, "mustChangePassword" = false
      WHERE "email" = $2
    `;
    
    await pool.query(updateQuery, [hashedPassword, 'ntokozomahlaela@gmail.com']);
    
    console.log('✅ Password updated successfully for ntokozomahlaela@gmail.com');
    console.log('🔑 New password: Ntokozo1');
    console.log('🔒 Must change password: false');
    
  } catch (error) {
    console.error('❌ Error updating member password:', error);
  } finally {
    await pool.end();
  }
}

fixMemberPassword();
