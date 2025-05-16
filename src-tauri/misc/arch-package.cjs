const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const confJsonPath = path.join(__dirname, '../tauri.conf.json');
const bundleDir = path.join(__dirname, '../target/release/bundle');
const buildDir = path.join(__dirname, '../target/release/bundle/aur/');

// Read the tauri.conf.json file
const confJson = JSON.parse(fs.readFileSync(confJsonPath, 'utf-8'));

// Extract package attributes
const productName = confJson.productName;
const pkgver = confJson.version;
const pkgdesc = confJson.bundle.longDescription;

// Copy deb file locally
const debPath = path.join(bundleDir, 'deb', `${productName}_${pkgver}_amd64.deb`);
const debBasename = path.basename(debPath);
const buildPath = path.join(buildDir, debBasename);

fs.ensureDirSync(buildDir);
fs.copySync(debPath, buildPath);

// Emit PKGBUILD
const pkgbuildContent = `
pkgname="${productName}-bin"
pkgver="${pkgver}"
pkgrel=1
pkgdesc="${pkgdesc}"
arch=('x86_64')
url=""
license=('All Right Reserved for now')
depends=('gtk3' 'webkit2gtk')
source=("${debBasename}")
sha512sums=("SKIP")

package(){
  tar -xz -f data.tar.gz -C "\${pkgdir}"
}
`;

fs.writeFileSync(path.join(buildDir, 'PKGBUILD'), pkgbuildContent);

console.log('AUR packages created successfully to '+buildDir);

if (process.platform === 'win32') {
  process.exit(0); 
}

try {
  execSync(`zip ${productName}_${pkgver}_amd64-arch.zip ${productName}_${pkgver}_amd64.deb PKGBUILD`, { cwd: buildDir, stdio: 'inherit' });
  const appImagePath = path.join(bundleDir, 'appimage');
  execSync(`zip ${productName}_${pkgver}_amd64-appimage.zip ${productName}_${pkgver}_amd64.AppImage`, { cwd: appImagePath, stdio: 'inherit' });
  const debPath = path.join(bundleDir, 'deb');
  execSync(`zip ${productName}_${pkgver}_amd64-deb.zip ${productName}_${pkgver}_amd64.deb`, { cwd: debPath, stdio: 'inherit' });
  const rpmPath = path.join(bundleDir, 'rpm');
  execSync(`zip ${productName}-${pkgver}.x86_64-rpm.zip ${productName}-${pkgver}-1.x86_64.rpm`, { cwd: rpmPath, stdio: 'inherit' });


// co-e33-save-editor-0.2.0-1.x86_64.rpm


  console.log('Package built and installed successfully.');
} catch (error) {
  console.error('Error during package build:', error.message);
}