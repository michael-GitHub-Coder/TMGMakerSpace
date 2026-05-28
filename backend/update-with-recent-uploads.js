const axios = require('axios');

async function updateWithRecentUploads() {
  try {
    console.log('🔄 Updating items with most recent member uploads...');
    
    // Get current marketplace items
    const itemsResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const items = itemsResponse.data;
    
    // Most recent uploads (sorted by time)
    const recentUploads = [
      'uploads/marketplace/image-1778524632604-347008552.png', // Today 8:37 PM
      'uploads/marketplace/image-1778523681963-467671411.png', // May 7th
      'uploads/marketplace/image-1778151732086-223939735.png', // May 7th  
      'uploads/marketplace/image-1778151391227-772961700.png', // May 7th
      'uploads/marketplace/image-1778151154648-164124676.png', // May 4th
    ];
    
    console.log(`📊 Found ${items.length} items to update`);
    console.log(`🖼️ Have ${recentUploads.length} recent uploads available`);
    
    // Update items with the most recent uploads
    for (let i = 0; i < items.length && i < recentUploads.length; i++) {
      const item = items[i];
      const recentImage = recentUploads[i];
      
      console.log(`\n📦 Updating: ${item.title}`);
      console.log(`🆔 ID: ${item.id}`);
      console.log(`🖼️ OLD image: ${item.image}`);
      console.log(`🖼️ NEW image: ${recentImage}`);
      
      const updateData = {
        ...item,
        image: recentImage
      };
      
      try {
        const updateResponse = await axios.put(`http://localhost:3000/api/marketplace/items/${item.id}`, updateData);
        console.log(`✅ Updated successfully!`);
        console.log(`📋 Response: ${updateResponse.data.image}`);
      } catch (error) {
        console.error(`❌ Failed to update ${item.title}:`, error.message);
      }
    }
    
    console.log('\n🔍 Verifying updates...');
    
    // Check final results
    const finalResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const finalItems = finalResponse.data;
    
    console.log(`\n📈 Final Results:`);
    console.log(`   Total items: ${finalItems.length}`);
    console.log(`   Items with images: ${finalItems.filter(item => item.image && item.image.trim() !== '').length}`);
    
    console.log('\n🖼️ Items now with recent uploads:');
    finalItems.forEach(item => {
      if (item.image && item.image.trim() !== '') {
        console.log(`   - ${item.title}: ${item.image}`);
        console.log(`     📅 Upload time: ${item.image.includes('1778524632604') ? '🆕 TODAY!' : '📅 Older'}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating items:', error.message);
  }
}

updateWithRecentUploads();
