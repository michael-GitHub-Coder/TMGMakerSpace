const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('Error: package.json not found in the current directory.');
  process.exit(1);
}

// Read the existing package.json
const packageJson = require(packageJsonPath);

// Update dependencies
packageJson.dependencies = {
  ...packageJson.dependencies,
  "bcryptjs": "^2.4.3",
  "compression": "^1.7.4",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.18.2",
  "express-mongo-sanitize": "^2.1.0",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0",
  "hpp": "^0.2.3",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.2.0",
  "morgan": "^1.10.0",
  "nodemailer": "^6.9.12",
  "validator": "^13.11.0",
  "xss-clean": "0.3.7"
};

// Update scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "start": "node server.js",
  "dev": "nodemon server.js",
  "prod": "NODE_ENV=production node server.js"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Installing dependencies...');

// Install dependencies
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing dependencies: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log('Dependencies installed successfully!');
  console.log('You can now start the server using:');
  console.log('  - For development: npm run dev');
  console.log('  - For production: npm run prod');
});
