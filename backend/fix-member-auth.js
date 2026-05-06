const { Pool } = require('pg');

async function fixMemberAuth() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== FIXING MEMBER AUTHENTICATION ===');
    
    // Update user to ensure mustChangePassword is properly set to false
    const updateQuery = `
      UPDATE "user" 
      SET "mustChangePassword" = false
      WHERE "email" = $1
    `;
    
    await pool.query(updateQuery, ['ntokozomahlaela@gmail.com']);
    
    console.log('✅ Updated mustChangePassword to false for ntokozomahlaela@gmail.com');
    console.log('🔑 Member will now use regular password authentication');
    
  } catch (error) {
    console.error('❌ Error fixing member auth:', error);
  } finally {
    await pool.end();
  }
}

fixMemberAuth();
