// This script clears any hardcoded blog data from localStorage
// Run this in the browser console to clear old blog data

console.log('Clearing localStorage blog data...');
localStorage.removeItem('blogs');
console.log('Blog data cleared from localStorage!');

// Also clear any other potential blog-related data
localStorage.removeItem('blogCache');
localStorage.removeItem('latestBlogsCache');
console.log('All blog-related cache cleared!');
