#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting build process...');
console.log('📁 Current working directory:', process.cwd());
console.log('📁 Script directory:', __dirname);

try {
  // List root directory to debug
  const rootContents = fs.readdirSync(__dirname);
  console.log('📂 Root directory contents:', rootContents);

  // Check if apps directory exists
  const appsDir = path.join(__dirname, 'apps');
  if (!fs.existsSync(appsDir)) {
    throw new Error(`Apps directory ${appsDir} does not exist`);
  }
  
  const appsContents = fs.readdirSync(appsDir);
  console.log('📂 Apps directory contents:', appsContents);

  // First install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Define shell directory
  const shellDir = path.join(__dirname, 'apps', 'shell');
  console.log(`📁 Working with directory: ${shellDir}`);
  
  // Check if shell directory exists
  if (!fs.existsSync(shellDir)) {
    throw new Error(`Directory ${shellDir} does not exist`);
  }
  
  // Check if package.json exists in shell
  const shellPackageJson = path.join(shellDir, 'package.json');
  if (!fs.existsSync(shellPackageJson)) {
    throw new Error(`package.json not found in ${shellDir}`);
  }
  
  console.log('📦 Installing shell dependencies...');
  execSync('npm install', { 
    cwd: shellDir, 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  console.log('🔨 Building shell app...');
  execSync('npx vite build', { 
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
    
    // Verify index.html exists
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html found in dist directory');
    } else {
      console.warn('⚠️ index.html not found in dist directory');
    }
  } else {
    throw new Error('❌ Build failed: dist directory not created');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
