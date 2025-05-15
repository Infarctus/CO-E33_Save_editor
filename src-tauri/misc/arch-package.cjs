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

trace('AUR packages created successfully to '+buildDir);
