#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting build process...');

try {
  // Change to shell directory
  const shellDir = path.join(__dirname, 'apps', 'shell');
  console.log(`📁 Changing to directory: ${shellDir}`);
  
  // Check if shell directory exists
  if (!fs.existsSync(shellDir)) {
    throw new Error(`Directory ${shellDir} does not exist`);
  }
  
  // Check if package.json exists in shell
  const shellPackageJson = path.join(shellDir, 'package.json');
  if (!fs.existsSync(shellPackageJson)) {
    throw new Error(`package.json not found in ${shellDir}`);
  }
  
  console.log('📦 Installing dependencies in shell app...');
  execSync('npm install', { 
    cwd: shellDir, 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('🔨 Building shell app...');
  execSync('npm run build', { 
    cwd: shellDir, 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Check if dist directory was created
  const distDir = path.join(shellDir, 'dist');
  if (fs.existsSync(distDir)) {
    console.log('✅ Build completed successfully!');
    console.log(`📂 Output directory: ${distDir}`);
    
    // List contents of dist directory
    const distContents = fs.readdirSync(distDir);
    console.log('📄 Built files:', distContents);
  } else {
    throw new Error('❌ Build failed: dist directory not created');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
