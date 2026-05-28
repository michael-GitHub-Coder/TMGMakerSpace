const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'Ntokz@084',
  database: process.env.DB_NAME || 'TMGMakerSpace',
});

async function fixImagePaths() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Check current image paths
    const result = await client.query('SELECT id, title, image FROM marketplace_items');
    console.log(`📊 Found ${result.rows.length} marketplace items`);
    
    let fixedCount = 0;
    
    for (const row of result.rows) {
      const imagePath = row.image;
      if (!imagePath) continue;
      
      let fixedPath = imagePath;
      
      // Fix duplicate uploads paths
      if (imagePath.includes('uploads/uploads/marketplace/')) {
        fixedPath = imagePath.replace('uploads/uploads/marketplace/', 'uploads/marketplace/');
        fixedCount++;
        console.log(`🔧 Fixing item ${row.id}: ${imagePath} -> ${fixedPath}`);
      } else if (imagePath.includes('marketplace/uploads/marketplace/')) {
        fixedPath = imagePath.replace('marketplace/uploads/marketplace/', 'uploads/marketplace/');
        fixedCount++;
        console.log(`🔧 Fixing item ${row.id}: ${imagePath} -> ${fixedPath}`);
      } else if (imagePath.includes('images/uploads/marketplace/')) {
        fixedPath = imagePath.replace('images/uploads/marketplace/', 'uploads/marketplace/');
        fixedCount++;
        console.log(`🔧 Fixing item ${row.id}: ${imagePath} -> ${fixedPath}`);
      }
      
      if (fixedPath !== imagePath) {
        await client.query('UPDATE marketplace_items SET image = $1 WHERE id = $2', [fixedPath, row.id]);
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} image paths in database`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

fixImagePaths();
