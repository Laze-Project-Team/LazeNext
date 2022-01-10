// キャッシュ削除
import fs from 'fs';

const CACHE_DIR = './cache';

const CLEAN_RANGE = 1000 * 60 * 60 * 24; // 1日

export const clean = async (): Promise<void> => {
  console.log('clean cache');

  const dirents = await fs.promises.readdir(CACHE_DIR, { withFileTypes: true });
  dirents.forEach(async (dirent) => {
    if (dirent.isDirectory()) {
      try {
        fs.promises.rm(`${CACHE_DIR}/${dirent.name}`, { recursive: true });
      } catch (err) {
        console.error(err);
      }
    } else {
      if (dirent.name.endsWith('.wasm')) {
        const stat = await fs.promises.stat(`${CACHE_DIR}/${dirent.name}`);
        if (stat.birthtimeMs < Date.now() - CLEAN_RANGE) {
          try {
            fs.promises.rm(`${CACHE_DIR}/${dirent.name}`);
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        if (dirent.name !== '.gitkeep') {
          try {
            fs.promises.rm(`${CACHE_DIR}/${dirent.name}`);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  });
};
