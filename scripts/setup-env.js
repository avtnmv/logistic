#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...');

const envExamplePath = path.join(__dirname, '..', 'env.example');
const envPath = path.join(__dirname, '..', '.env');

// Проверяем, существует ли файл .env
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('📝 If you need to update it, please edit .env manually');
  return;
}

// Проверяем, существует ли файл env.example
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.example file not found');
  console.log('📝 Please create env.example with your configuration template');
  return;
}

try {
  // Копируем env.example в .env
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envPath, envExampleContent);
  
  console.log('✅ .env file created from env.example');
  console.log('📝 Please edit .env file with your actual values');
  console.log('');
  console.log('⚠️  Important:');
  console.log('   - Never commit .env file to version control');
  console.log('   - Replace placeholder values with real credentials');
  console.log('   - Restart development server after changes');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Edit .env file with your configuration');
  console.log('   2. Run: npm start');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}
