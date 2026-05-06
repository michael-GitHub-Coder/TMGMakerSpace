const { Pool } = require('pg');

async function updateAdminRole() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    // Update ntokozomahlaela2@gmail.com to admin role
    const updateQuery = `
      UPDATE "user" 
      SET "role" = 'admin', "mustChangePassword" = false
      WHERE "email" = $1
    `;
    
    await pool.query(updateQuery, ['ntokozomahlaela2@gmail.com']);
    console.log('✅ Updated ntokozomahlaela2@gmail.com to admin role');
    
    // Delete superadmin user
    const deleteQuery = `
      DELETE FROM "user" 
      WHERE "email" = $1
    `;
    
    await pool.query(deleteQuery, ['superadmin@tmgmakerspace.com']);
    console.log('✅ Deleted superadmin@tmgmakerspace.com');
    
    console.log('\n🎉 Admin role update completed!');
    console.log('📧 Email: ntokozomahlaela2@gmail.com');
    console.log('🔑 Password: password123');
    console.log('👤 Role: admin (not superadmin)');
    
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
  } finally {
    await pool.end();
  }
}

updateAdminRole();
