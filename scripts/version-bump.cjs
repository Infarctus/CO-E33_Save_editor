const fs = require('fs');
const path = require('path');

console.log('Bumping version...');
const newVersion = process.argv[2];

if (!newVersion || newVersion.split(".").length !== 3) {
    console.error('Usage: npm run version:bump <newversion> (e.g., 1.0.1)');
    process.exit(1);
}
console.log(`New version: ${newVersion}`);

function updateFile(filePath, updateFn) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = updateFn(content);
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated: ${filePath}`);
  }
}

updateFile('package.json', (content) => {
  const pkg = JSON.parse(content);
  pkg.version = newVersion;
  return JSON.stringify(pkg, null, 2);
});

updateFile('package-lock.json', (content) => {
  const lock = JSON.parse(content);
  lock.version = newVersion;
  if (lock.packages && lock.packages[""]) {
    lock.packages[""].version = newVersion;
  }
  return JSON.stringify(lock, null, 2);
});

updateFile('src-tauri/Cargo.toml', (content) => {
  return content.replace(/^version\s*=\s*"[^"]*"/m, `version = "${newVersion}"`);
});

updateFile('src-tauri/tauri.conf.json', (content) => {
  const config = JSON.parse(content);
  if (config.version) {
    config.version = newVersion;
  }
  return JSON.stringify(config, null, 2);
});

console.log(`Version bump complete: ${newVersion}`);