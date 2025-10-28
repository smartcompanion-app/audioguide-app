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

// Escape string for use in JavaScript code
function escapeJs(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\f/g, '\\f')
    .replace(/\v/g, '\\v');
}

// Escape string for use in HTML attributes
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Validate CSS color value to prevent SCSS injection
function validateColor(color) {
  // Allow hex colors (3 or 6 digits with optional alpha)
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(color)) {
    return true;
  }
  
  // Allow named colors (common CSS color names)
  const namedColors = [
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black',
    'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
    'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
    'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki',
    'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon',
    'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
    'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue',
    'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite',
    'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew', 'hotpink',
    'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen',
    'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
    'lightgray', 'lightgrey', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen',
    'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
    'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue',
    'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
    'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose',
    'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange',
    'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred',
    'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red',
    'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell',
    'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
    'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet',
    'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen', 'transparent'
  ];
  
  if (namedColors.includes(color.toLowerCase())) {
    return true;
  }
  
  // Allow rgb/rgba colors with proper value ranges
  const rgbMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch;
    const rNum = parseInt(r, 10);
    const gNum = parseInt(g, 10);
    const bNum = parseInt(b, 10);
    
    // Check RGB values are in range 0-255
    if (rNum < 0 || rNum > 255 || gNum < 0 || gNum > 255 || bNum < 0 || bNum > 255) {
      return false;
    }
    
    // Check alpha is in range 0-1 if present
    if (a !== undefined) {
      const aNum = parseFloat(a);
      if (isNaN(aNum) || aNum < 0 || aNum > 1) {
        return false;
      }
    }
    
    return true;
  }
  
  // Allow hsl/hsla colors with proper value ranges
  const hslMatch = color.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (hslMatch) {
    const [, h, s, l, a] = hslMatch;
    const hNum = parseInt(h, 10);
    const sNum = parseInt(s, 10);
    const lNum = parseInt(l, 10);
    
    // Check hue is 0-360, saturation and lightness are 0-100
    if (hNum < 0 || hNum > 360 || sNum < 0 || sNum > 100 || lNum < 0 || lNum > 100) {
      return false;
    }
    
    // Check alpha is in range 0-1 if present
    if (a !== undefined) {
      const aNum = parseFloat(a);
      if (isNaN(aNum) || aNum < 0 || aNum > 1) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
}

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
    const config = JSON.parse(configContent);
    validateConfig(config);
    return config;
  } catch (error) {
    console.error(`Error reading or parsing config file: ${error.message}`);
    process.exit(1);
  }
}

// Validate configuration structure
function validateConfig(config) {
  const required = {
    app: ['title', 'description', 'dataUrl', 'offlineSupport'],
    colors: ['background', 'cardBackground', 'stationIcon', 'menuBorder', 
             'primary', 'primaryContrast', 'primaryShade', 'primaryTint'],
    images: ['logo', 'icon', 'favicon']
  };

  for (const [section, fields] of Object.entries(required)) {
    if (!config[section]) {
      throw new Error(`Missing required section: ${section}`);
    }
    for (const field of fields) {
      if (config[section][field] === undefined) {
        throw new Error(`Missing required field: ${section}.${field}`);
      }
    }
  }

  // Validate offline support is boolean
  if (typeof config.app.offlineSupport !== 'boolean') {
    throw new Error('app.offlineSupport must be true or false');
  }

  // Validate color values
  for (const [colorName, colorValue] of Object.entries(config.colors)) {
    if (!validateColor(colorValue)) {
      throw new Error(
        `Invalid color value for colors.${colorName}: "${colorValue}". ` +
        'Color must be a hex color (#fff or #ffffff), named color (e.g., white), ' +
        'rgb/rgba (e.g., rgb(255,255,255)), or hsl/hsla (e.g., hsl(0,0%,100%)).'
      );
    }
  }
}

// Update stencil.config.ts
function updateStencilConfig(config) {
  const configPath = path.resolve('stencil.config.ts');
  let content = fs.readFileSync(configPath, 'utf8');

  // Update TITLE
  content = content.replace(
    /const TITLE = ".*?";/,
    `const TITLE = "${escapeJs(config.app.title)}";`
  );

  // Update DATA_URL
  content = content.replace(
    /const DATA_URL = ".*?";/,
    `const DATA_URL = "${escapeJs(config.app.dataUrl)}";`
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
    `<title>${escapeHtml(config.app.title)}</title>`
  );

  // Update description
  content = content.replace(
    /<meta name="Description" content=".*?">/,
    `<meta name="Description" content="${escapeHtml(config.app.description)}">`
  );

  // Update theme-color (colors should be validated CSS, but we'll escape for safety)
  content = content.replace(
    /<meta name="theme-color" content=".*?">/,
    `<meta name="theme-color" content="${escapeHtml(config.colors.background)}">`
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

  // Update color variables - use flexible pattern to match any color format
  content = content.replace(
    /\$background-color: [^;]+;/,
    `$background-color: ${config.colors.background};`
  );

  content = content.replace(
    /\$card-background-color: [^;]+;/,
    `$card-background-color: ${config.colors.cardBackground};`
  );

  content = content.replace(
    /\$station-icon-color: [^;]+;/,
    `$station-icon-color: ${config.colors.stationIcon};`
  );

  content = content.replace(
    /\$menu-border-color: [^;]+;/,
    `$menu-border-color: ${config.colors.menuBorder};`
  );

  content = content.replace(
    /\$primary-color: [^;]+;/,
    `$primary-color: ${config.colors.primary};`
  );

  content = content.replace(
    /\$primary-color-contrast: [^;]+;/,
    `$primary-color-contrast: ${config.colors.primaryContrast};`
  );

  content = content.replace(
    /\$primary-color-shade: [^;]+;/,
    `$primary-color-shade: ${config.colors.primaryShade};`
  );

  content = content.replace(
    /\$primary-color-tint: [^;]+;/,
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
