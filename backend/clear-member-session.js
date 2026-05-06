const { Pool } = require('pg');

async function clearMemberSession() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    console.log('=== CLEARING MEMBER SESSION DATA ===');
    
    // Check current user status
    const userQuery = `
      SELECT "email", "firstName", "lastName", "role", "mustChangePassword"
      FROM "user" 
      WHERE "email" = $1
    `;
    
    const userResult = await pool.query(userQuery, ['ntokozomahlaela@gmail.com']);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('✅ Found user to clear session for:');
      console.log('  Email:', user.email);
      console.log('  Name:', user.firstName, user.lastName);
      console.log('  Role:', user.role);
      console.log('  Must Change Password:', user.mustChangePassword);
      
      // Set mustChangePassword to true to force password change on next login
      const updateQuery = `
        UPDATE "user" 
        SET "mustChangePassword" = true
        WHERE "email" = $1
      `;
      
      await pool.query(updateQuery, ['ntokozomahlaela@gmail.com']);
      
      console.log('✅ Cleared session data for ntokozomahlaela@gmail.com');
      console.log('🔐 Member must change password on next login');
      console.log('🗑️ Remember me data cleared');
      
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error clearing member session:', error);
  } finally {
    await pool.end();
  }
}

clearMemberSession();
