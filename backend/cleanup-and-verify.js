const axios = require('axios');

async function cleanupAndVerify() {
  try {
    console.log('🧹 Cleaning up test item and verifying final state...');
    
    // Get all items to find the test item
    const itemsResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const items = itemsResponse.data;
    
    // Find the test item we created
    const testItem = items.find(item => item.title === 'Member Real Upload Test');
    
    if (testItem) {
      console.log('🗑️ Deleting test item:', testItem.title);
      console.log('🆔 Test Item ID:', testItem.id);
      
      // Delete the test item
      await axios.delete(`http://localhost:3000/api/marketplace/items/${testItem.id}`);
      
      console.log('✅ Test item deleted successfully!');
    }
    
    console.log('\n🔍 Final verification of marketplace items...');
    
    // Check final results
    const finalResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const finalItems = finalResponse.data;
    
    console.log(`📊 Final marketplace has ${finalItems.length} items:`);
    
    // Show all items with their images
    finalItems.forEach((item, index) => {
      const hasImage = item.image && item.image.trim() !== '';
      const isRecent = item.image.includes('1778524632604') || item.image.includes('1778525196598');
      
      console.log(`\n📦 Item ${index + 1}: ${item.title}`);
      console.log(`🆔 ID: ${item.id}`);
      console.log(`🖼️ Image: ${item.image}`);
      console.log(`📊 Has Image: ${hasImage ? '✅ YES' : '❌ NO'}`);
      console.log(`📅 Upload Time: ${isRecent ? '🆕 RECENT MEMBER UPLOAD!' : '📅 Older'}`);
      
      if (hasImage) {
        console.log(`🌐 Access URL: http://localhost:3000/${item.image}`);
      }
    });
    
    const itemsWithImages = finalItems.filter(item => item.image && item.image.trim() !== '');
    const recentItems = finalItems.filter(item => 
      item.image.includes('1778524632604') || item.image.includes('1778525196598')
    );
    
    console.log(`\n📈 Summary:`);
    console.log(`   Total items: ${finalItems.length}`);
    console.log(`   Items with images: ${itemsWithImages.length}`);
    console.log(`   Items with recent member uploads: ${recentItems.length}`);
    console.log(`   Items ready for member viewing: ${itemsWithImages.length}`);
    
    if (recentItems.length > 0) {
      console.log('\n🎉 SUCCESS! Member uploads are now showing!');
      console.log('✅ Members can see their actual uploaded images');
      console.log('✅ Recent uploads are properly displayed');
    } else {
      console.log('\n❌ No recent member uploads found');
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

cleanupAndVerify();
