const path = require('path');
const fs = require('fs');

// Create a dist directory if it doesn't exist
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/popup/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    // Copy static assets to dist folder
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CopyAssets', (compilation) => {
          // Copy HTML files
          if (fs.existsSync('./src/popup')) {
            if (!fs.existsSync('./dist/popup')) {
              fs.mkdirSync('./dist/popup', { recursive: true });
            }
            
            // Copy HTML files from popup directory
            fs.readdirSync('./src/popup').forEach(file => {
              if (file.endsWith('.html')) {
                fs.copyFileSync(`./src/popup/${file}`, `./dist/popup/${file}`);
              }
            });
          }
          
          // Copy assets folder if it exists
          if (fs.existsSync('./assets')) {
            if (!fs.existsSync('./dist/assets')) {
              fs.mkdirSync('./dist/assets', { recursive: true });
            }
            
            // Copy all files from assets directory
            fs.readdirSync('./assets').forEach(file => {
              fs.copyFileSync(`./assets/${file}`, `./dist/assets/${file}`);
            });
          } else if (fs.existsSync('./src/assets')) {
            // If assets are in src/assets, copy them to dist/assets
            if (!fs.existsSync('./dist/assets')) {
              fs.mkdirSync('./dist/assets', { recursive: true });
            }
            
            // Copy all files from src/assets directory
            fs.readdirSync('./src/assets').forEach(file => {
              fs.copyFileSync(`./src/assets/${file}`, `./dist/assets/${file}`);
            });
          }
        });
      }
    }
  ]
}; 