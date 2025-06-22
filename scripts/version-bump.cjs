const fs = require('fs');
const { execSync } = require('child_process');

const versionType = process.argv[2]; // patch, minor, major

if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Usage: pnpm run version:bump:<patch|minor|major>');
  process.exit(1);
}

function updateFile(filePath, updateFn) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = updateFn(content);
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated: ${filePath}`);
  }
}

// Get current version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`Current version: ${currentVersion}`);
console.log(`Running pnpm version ${versionType}...`);

// Use pnpm version to update package.json and package-lock.json
// This also creates a git commit and tag by default
try {
  // Use --no-git-tag-version if you don't want git tags created
  execSync(`pnpm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run pnpm version:', error);
  process.exit(1);
}

// Read the new version after pnpm has updated it
const updatedPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newVersion = updatedPackageJson.version;

console.log(`Version bumped to: ${newVersion}`);

// Update Cargo.toml (Tauri backend)
updateFile('src-tauri/Cargo.toml', (content) => {
  return content.replace(/^version\s*=\s*"[^"]*"/m, `version = "${newVersion}"`);
});

// Update tauri.conf.json
updateFile('src-tauri/tauri.conf.json', (content) => {
  const config = JSON.parse(content);
  if (config.version) {
    config.version = newVersion;
  }
  return JSON.stringify(config, null, 2);
});

console.log(`Version bump complete: ${newVersion}`);