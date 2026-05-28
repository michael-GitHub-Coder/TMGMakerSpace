const axios = require('axios');

async function updateAllItemsWithImages() {
  try {
    console.log('🧪 Updating all marketplace items with images...');
    
    // Get existing items
    const itemsResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const items = itemsResponse.data;
    
    // Get available uploaded images
    const uploadedImages = [
      'uploads/marketplace/image-1777921513627-736999696.png',
      'uploads/marketplace/image-1777921791646-114567034.png', 
      'uploads/marketplace/image-1777921817687-946375054.png',
      'uploads/marketplace/image-1777921999195-683637749.png'
    ];
    
    console.log(`📊 Found ${items.length} items to update`);
    console.log(`🖼️ Have ${uploadedImages.length} images available`);
    
    // Update items without images
    for (let i = 0; i < items.length && i < uploadedImages.length; i++) {
      const item = items[i];
      const imageUrl = uploadedImages[i];
      
      if (!item.image || item.image.trim() === '') {
        console.log(`\n📦 Updating: ${item.title}`);
        console.log(`🆔 ID: ${item.id}`);
        console.log(`🖼️ Setting image: ${imageUrl}`);
        
        const updateData = {
          ...item,
          image: imageUrl
        };
        
        try {
          const updateResponse = await axios.put(`http://localhost:3000/api/marketplace/items/${item.id}`, updateData);
          console.log(`✅ Updated successfully!`);
        } catch (error) {
          console.error(`❌ Failed to update ${item.title}:`, error.message);
        }
      } else {
        console.log(`⏭️ Skipping ${item.title} - already has image`);
      }
    }
    
    console.log('\n🔍 Verifying updates...');
    
    // Check final results
    const finalResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const finalItems = finalResponse.data;
    
    const itemsWithImages = finalItems.filter(item => item.image && item.image.trim() !== '');
    console.log(`\n📈 Final Results:`);
    console.log(`   Total items: ${finalItems.length}`);
    console.log(`   Items with images: ${itemsWithImages.length}`);
    console.log(`   Items without images: ${finalItems.length - itemsWithImages.length}`);
    
    console.log('\n🖼️ Items now with images:');
    finalItems.forEach(item => {
      if (item.image && item.image.trim() !== '') {
        console.log(`   - ${item.title}: ${item.image}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating items:', error.message);
  }
}

updateAllItemsWithImages();
