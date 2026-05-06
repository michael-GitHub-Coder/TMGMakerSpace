const http = require('http');

async function createOriginalAdmin() {
  const adminData = {
    firstName: 'Ntokozo',
    lastName: 'Mahlaela',
    email: 'ntokozomahlaela2@gmail.com',
    password: 'password123',
    role: 'superadmin'
  };

  const postData = JSON.stringify(adminData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/auth/signup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('✅ Response:', res.statusCode);
        console.log('📄 Response body:', data);
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

createOriginalAdmin().then(() => {
  console.log('\n🎉 Original admin creation completed!');
  console.log('📧 Email: ntokozomahlaela2@gmail.com');
  console.log('🔑 Password: password123');
  console.log('👤 Role: superadmin');
}).catch(console.error);
