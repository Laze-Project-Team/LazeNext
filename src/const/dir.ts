const searchNext = __dirname.search(/\.next/);
const searchDist = __dirname.search(/dist/);
const searchSrc = __dirname.search(/src/);
export const ROOT_DIR = (() => {
  if (searchNext > 0) {
    return __dirname.slice(0, searchNext - 1);
  }
  if (searchDist > 0) {
    return __dirname.slice(0, searchDist - 1);
  }
  if (searchSrc > 0) {
    return __dirname.slice(0, searchSrc - 1);
  }
  return __dirname;
})();

export const SAMPLE_DIR = ROOT_DIR + '/data/samples';
export const CACHE_DIR = ROOT_DIR + '/cache';
export const DATA_DIR = ROOT_DIR + '/data';
export const COMPETITION_DIR = ROOT_DIR + '/competitions';
export const COMMON_DIR = ROOT_DIR + '/data/common';
export const LANG_DIR = ROOT_DIR + '/data/lang';
export const PARSER_DIR = ROOT_DIR + '/data/parser';
export const DOCS_DIR = ROOT_DIR + '/docs';
