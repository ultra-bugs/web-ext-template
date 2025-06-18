# Web Extension Template

A cross-browser extension template that works with both Chromium-based browsers and Firefox. Use this as a starting point for your browser extension projects.

## Project Structure

```
web-extension-template/
├── src/                  # Source code
│   ├── background.js     # Background script
│   ├── content.js        # Content script
│   └── popup/            # Popup UI
│       ├── index.js      # Popup script
│       └── popup.html    # Popup HTML
├── assets/               # Icons and static assets
├── _manifest.json        # Common manifest properties
├── manifest-chromium.json # Chromium-specific manifest properties
├── manifest-firefox.json # Firefox-specific manifest properties
├── merge-manifest.js     # Script to merge manifest files
├── webpack.config.js     # Webpack configuration
└── package.json          # Project dependencies
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Replace yours `assets` directory and add icon files

## Development

For development with live reloading:

```bash
npm run dev
```

## Building

Build for Chromium-based browsers:

```bash
npm run build:chromium
```

Build for Firefox:

```bash
npm run build:firefox
```

Build for both:

```bash
npm run build
```

The built extensions will be available in the `dist` directory.

## Installation

### Chrome/Edge/Brave

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" 
4. Select the `dist` directory after building for Chromium

### Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the `manifest.json` file in the `dist` directory after building for Firefox

## Features

- Complete cross-browser compatibility with unified API
- Modern JavaScript with Babel transpilation
- Webpack bundling with development mode
- Separate manifest files for different browser platforms
- Ready-to-use popup user interface
- Communication between background and content scripts

## Development Notes

- Uses `webextension-polyfill` to ensure compatibility between Chromium and Firefox
- Follows best practices for extension architecture
- Easily customizable for your specific extension needs 