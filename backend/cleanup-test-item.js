const axios = require('axios');

async function cleanupTestItem() {
  try {
    console.log('🧹 Cleaning up test item...');
    
    // Get all items to find the test item
    const itemsResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const items = itemsResponse.data;
    
    // Find the test item we created
    const testItem = items.find(item => item.title === 'Test Member Upload Item');
    
    if (testItem) {
      console.log('🗑️ Deleting test item:', testItem.title);
      console.log('🆔 Test Item ID:', testItem.id);
      
      // Delete the test item
      await axios.delete(`http://localhost:3000/api/marketplace/items/${testItem.id}`);
      
      console.log('✅ Test item deleted successfully!');
      
      // Verify deletion
      const finalItemsResponse = await axios.get('http://localhost:3000/api/marketplace/items');
      const finalItems = finalItemsResponse.data;
      
      console.log(`📊 Final item count: ${finalItems.length}`);
      
      const remainingTestItems = finalItems.filter(item => item.title === 'Test Member Upload Item');
      if (remainingTestItems.length === 0) {
        console.log('✅ Test item completely removed!');
      }
      
    } else {
      console.log('ℹ️ No test item found to delete');
    }
    
    console.log('\n🎉 Marketplace is ready for real member uploads!');
    console.log('📋 Current items:');
    
    const finalItemsResponse = await axios.get('http://localhost:3000/api/marketplace/items');
    const finalItems = finalItemsResponse.data;
    
    finalItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title} - ${item.image ? '✅ Has Image' : '❌ No Image'}`);
    });
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

cleanupTestItem();
