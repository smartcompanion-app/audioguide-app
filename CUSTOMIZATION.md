# Customization Configuration Guide

This guide explains the structure and options available in the customization configuration file.

## Configuration File Structure

The configuration file is a JSON file with three main sections:

### 1. App Settings

```json
"app": {
  "title": "My Museum",
  "description": "An audioguide app for My Museum",
  "dataUrl": "https://example.com/data.json",
  "offlineSupport": false
}
```

- **title**: The name of your app (appears in browser tab, PWA manifest, and index.html)
- **description**: A brief description of your app (used in HTML meta tags)
- **dataUrl**: URL to your `data.json` file containing audioguide content
- **offlineSupport**: `true` or `false` - enables/disables offline support via service worker

### 2. Color Scheme

```json
"colors": {
  "background": "#faefdc",
  "cardBackground": "#f7e6c7",
  "stationIcon": "#305653",
  "menuBorder": "#f4dcb3",
  "primary": "#8fc0bd",
  "primaryContrast": "white",
  "primaryShade": "#7ea9a6",
  "primaryTint": "#9ac6c4"
}
```

All colors should be in hex format (e.g., `#ffffff`) or named colors (e.g., `white`).

- **background**: Main background color of the app
- **cardBackground**: Background color for cards and content areas
- **stationIcon**: Color for station icons
- **menuBorder**: Border color for menu items
- **primary**: Primary brand color (used for buttons, active states, etc.)
- **primaryContrast**: Text/icon color on primary backgrounds (usually `white` or `black`)
- **primaryShade**: Darker variant of primary color (for hover/active states)
- **primaryTint**: Lighter variant of primary color (for highlights)

**Tip**: Use the [Ionic Color Generator](https://ionicframework.com/docs/theming/colors#new-color-creator) to calculate shade and tint values from your primary color.

### 3. Images

```json
"images": {
  "logo": "path/to/logo.png",
  "icon": "path/to/icon.png",
  "favicon": "path/to/favicon.ico"
}
```

- **logo**: Path to your logo image (displayed in the app header)
- **icon**: Path to your app icon (512x512px PNG recommended, used as PWA icon)
- **favicon**: Path to your favicon (ICO format)

Image paths can be:
- Relative to the project root
- Absolute paths
- If the path equals the default location (e.g., `src/assets/logo.png`), no file copy occurs

## Example Configurations

### Minimal Configuration

```json
{
  "app": {
    "title": "My Museum",
    "description": "My audioguide app",
    "dataUrl": "https://example.com/data.json",
    "offlineSupport": false
  },
  "colors": {
    "background": "#ffffff",
    "cardBackground": "#f5f5f5",
    "stationIcon": "#333333",
    "menuBorder": "#e0e0e0",
    "primary": "#007bff",
    "primaryContrast": "white",
    "primaryShade": "#0056b3",
    "primaryTint": "#3395ff"
  },
  "images": {
    "logo": "src/assets/logo.png",
    "icon": "src/assets/icon/icon.png",
    "favicon": "src/assets/icon/favicon.ico"
  }
}
```

### With Custom Images

```json
{
  "app": {
    "title": "Castle Museum",
    "description": "Audioguide for Castle Museum",
    "dataUrl": "https://mycdn.com/castle-data.json",
    "offlineSupport": true
  },
  "colors": {
    "background": "#1a1a2e",
    "cardBackground": "#16213e",
    "stationIcon": "#0f3460",
    "menuBorder": "#533483",
    "primary": "#e94560",
    "primaryContrast": "white",
    "primaryShade": "#c93a51",
    "primaryTint": "#ec5f75"
  },
  "images": {
    "logo": "./branding/castle-logo.png",
    "icon": "./branding/castle-icon.png",
    "favicon": "./branding/castle-favicon.ico"
  }
}
```

## Usage

1. Copy `config.example.json` to `config.json`
2. Edit `config.json` with your custom values
3. Run `npm run customize` to apply your configuration
4. Build your app with `npm run build`

## Tips

- Keep a backup of your `config.json` for future deployments
- Test your color scheme in both light and dark environments
- Ensure your custom images meet the recommended dimensions
- Validate your JSON before running the customize script
- After customization, review the changes before building
