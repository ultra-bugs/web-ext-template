const fs = require('fs');

function mergeManifests(basePath, specificPath, outputPath) {
  // Read the base and specific manifest files
  const baseManifest = JSON.parse(fs.readFileSync(basePath, 'utf8'));
  const specificManifest = JSON.parse(fs.readFileSync(specificPath, 'utf8'));

  // Deep merge the manifests with specific manifest taking precedence
  const mergedManifest = { ...baseManifest, ...specificManifest };

  // Ensure the dist directory exists
  const distDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write the merged manifest to the output path
  fs.writeFileSync(outputPath, JSON.stringify(mergedManifest, null, 2));
  
  console.log(`Successfully merged ${basePath} and ${specificPath} into ${outputPath}`);
}

// Get command line arguments
const [,, basePath, specificPath, outputPath] = process.argv;

if (!basePath || !specificPath || !outputPath) {
  console.error('Usage: node merge-manifest.js <basePath> <specificPath> <outputPath>');
  process.exit(1);
}

mergeManifests(basePath, specificPath, outputPath); 