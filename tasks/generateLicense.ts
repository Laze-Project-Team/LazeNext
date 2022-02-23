import { execSync as exec } from 'child_process';
import compareVersions from 'compare-versions';
import fs from 'fs';
import path from 'path';

import { DATA_DIR } from '@/const/dir';

type license = {
  licenses: string;
  repository?: string;
  publisher?: string;
  email?: string;
  url?: string;
  private?: boolean;
  path?: string;
  licenseFile?: string;
};

export type licenseType = Record<string, license>;

export type renderLicenseType = Record<string, Omit<license, 'path' | 'licenseFile'>>;

const filePath = path.join(DATA_DIR, 'etc', 'license.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

exec(`license-checker --production --json > ${filePath}`);

const licenses: licenseType = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
const renderLicense: renderLicenseType = {};
const versions: Record<string, string> = {};

Object.keys(licenses).forEach((key) => {
  const license = licenses[key];
  // 自作ライブラリ(private=true)を除外
  if (!license.private) {
    const match = key.match(/(.+)@(.+)$/);
    if (match) {
      const name = match[1];
      const version = match[2];
      if (!Object.prototype.hasOwnProperty.call(versions, name)) {
        versions[name] = version;
        renderLicense[name] = {
          licenses: license.licenses,
          repository: license.repository,
          publisher: license.publisher,
          email: license.email,
          url: license.url,
        };
      } else if (compareVersions(versions[name], version) < 1) {
        // 重複している場合、最新バージョンのみ含める
        delete renderLicense[name + '@' + versions[name]];
        renderLicense[key] = license;
        versions[name] = version;
      }
    }
  }
});

fs.writeFileSync(filePath, JSON.stringify(renderLicense, null, 2));
