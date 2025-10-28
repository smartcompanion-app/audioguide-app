#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * SmartCompanion Audioguide App Customization Script
 * 
 * This script applies a configuration file to customize the app's appearance,
 * content, and settings. It updates various files including:
 * - stencil.config.ts (title, data URL, offline support)
 * - src/index.html (title, description, theme color)
 * - src/manifest.json (name, colors)
 * - src/global/app.scss (color variables)
 */

const CONFIG_FILE = process.argv[2] || 'config.json';

// Load configuration
function loadConfig() {
  const configPath = path.resolve(CONFIG_FILE);
  
  if (!fs.existsSync(configPath)) {
    console.error(`Error: Configuration file '${CONFIG_FILE}' not found.`);
    console.error(`Please create a config file or use: npm run customize <path-to-config.json>`);
    console.error(`You can use config.example.json as a template.`);
    process.exit(1);
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`Error reading or parsing config file: ${error.message}`);
    process.exit(1);
  }
}

// Update stencil.config.ts
function updateStencilConfig(config) {
  const configPath = path.resolve('stencil.config.ts');
  let content = fs.readFileSync(configPath, 'utf8');

  // Update TITLE
  content = content.replace(
    /const TITLE = ".*?";/,
    `const TITLE = "${config.app.title}";`
  );

  // Update DATA_URL
  content = content.replace(
    /const DATA_URL = ".*?";/,
    `const DATA_URL = "${config.app.dataUrl}";`
  );

  // Update OFFLINE_SUPPORT
  content = content.replace(
    /const OFFLINE_SUPPORT = (true|false);/,
    `const OFFLINE_SUPPORT = ${config.app.offlineSupport};`
  );

  fs.writeFileSync(configPath, content, 'utf8');
  console.log('✓ Updated stencil.config.ts');
}

// Update index.html
function updateIndexHtml(config) {
  const htmlPath = path.resolve('src/index.html');
  let content = fs.readFileSync(htmlPath, 'utf8');

  // Update title
  content = content.replace(
    /<title>.*?<\/title>/,
    `<title>${config.app.title}</title>`
  );

  // Update description
  content = content.replace(
    /<meta name="Description" content=".*?">/,
    `<meta name="Description" content="${config.app.description}">`
  );

  // Update theme-color
  content = content.replace(
    /<meta name="theme-color" content=".*?">/,
    `<meta name="theme-color" content="${config.colors.background}">`
  );

  fs.writeFileSync(htmlPath, content, 'utf8');
  console.log('✓ Updated src/index.html');
}

// Update manifest.json
function updateManifest(config) {
  const manifestPath = path.resolve('src/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  manifest.name = config.app.title;
  manifest.short_name = config.app.title;
  manifest.background_color = config.colors.background;
  manifest.theme_color = config.colors.background;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('✓ Updated src/manifest.json');
}

// Update app.scss
function updateAppScss(config) {
  const scssPath = path.resolve('src/global/app.scss');
  let content = fs.readFileSync(scssPath, 'utf8');

  // Update color variables
  content = content.replace(
    /\$background-color: #[0-9a-fA-F]{6};/,
    `$background-color: ${config.colors.background};`
  );

  content = content.replace(
    /\$card-background-color: #[0-9a-fA-F]{6};/,
    `$card-background-color: ${config.colors.cardBackground};`
  );

  content = content.replace(
    /\$station-icon-color: #[0-9a-fA-F]{6};/,
    `$station-icon-color: ${config.colors.stationIcon};`
  );

  content = content.replace(
    /\$menu-border-color: #[0-9a-fA-F]{6};/,
    `$menu-border-color: ${config.colors.menuBorder};`
  );

  content = content.replace(
    /\$primary-color: #[0-9a-fA-F]{6};/,
    `$primary-color: ${config.colors.primary};`
  );

  content = content.replace(
    /\$primary-color-contrast: .*?;/,
    `$primary-color-contrast: ${config.colors.primaryContrast};`
  );

  content = content.replace(
    /\$primary-color-shade: #[0-9a-fA-F]{6};/,
    `$primary-color-shade: ${config.colors.primaryShade};`
  );

  content = content.replace(
    /\$primary-color-tint: #[0-9a-fA-F]{6};/,
    `$primary-color-tint: ${config.colors.primaryTint};`
  );

  fs.writeFileSync(scssPath, content, 'utf8');
  console.log('✓ Updated src/global/app.scss');
}

// Copy image files if specified and different from defaults
function copyImages(config) {
  const images = config.images || {};
  
  if (images.logo && images.logo !== 'src/assets/logo.png') {
    const sourcePath = path.resolve(images.logo);
    const targetPath = path.resolve('src/assets/logo.png');
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied logo from ${images.logo}`);
    } else {
      console.warn(`⚠ Warning: Logo file not found at ${images.logo}`);
    }
  }

  if (images.icon && images.icon !== 'src/assets/icon/icon.png') {
    const sourcePath = path.resolve(images.icon);
    const targetPath = path.resolve('src/assets/icon/icon.png');
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied icon from ${images.icon}`);
    } else {
      console.warn(`⚠ Warning: Icon file not found at ${images.icon}`);
    }
  }

  if (images.favicon && images.favicon !== 'src/assets/icon/favicon.ico') {
    const sourcePath = path.resolve(images.favicon);
    const targetPath = path.resolve('src/assets/icon/favicon.ico');
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied favicon from ${images.favicon}`);
    } else {
      console.warn(`⚠ Warning: Favicon file not found at ${images.favicon}`);
    }
  }
}

// Main execution
function main() {
  console.log('SmartCompanion Audioguide App - Customization Script');
  console.log('===================================================\n');

  const config = loadConfig();
  console.log(`Using configuration from: ${CONFIG_FILE}\n`);

  try {
    updateStencilConfig(config);
    updateIndexHtml(config);
    updateManifest(config);
    updateAppScss(config);
    copyImages(config);

    console.log('\n✓ Customization completed successfully!');
    console.log('\nNext steps:');
    console.log('  1. Review the changes in the modified files');
    console.log('  2. Run "npm run build" to build your customized app');
    console.log('  3. Run "npm start" to preview your customized app\n');
  } catch (error) {
    console.error(`\n✗ Error during customization: ${error.message}`);
    process.exit(1);
  }
}

main();
