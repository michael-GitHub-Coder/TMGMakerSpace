const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function createAdmin() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ntokz@084',
    database: 'TMGMakerSpace'
  });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    const insertQuery = `
      INSERT INTO "user" ("firstName", "lastName", "email", "password", "role", "mustChangePassword")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("email") DO NOTHING
    `;
    
    const values = [
      'Admin',
      'User',
      'admin@tmgmakerspace.com',
      hashedPassword,
      'superadmin',
      false
    ];
    
    await pool.query(insertQuery, values);
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@tmgmakerspace.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: superadmin');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();
