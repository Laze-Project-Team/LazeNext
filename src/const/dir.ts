const search = __dirname.search(/\.next/);
export const ROOT_DIR = search > 0 ? __dirname.slice(0, search - 1) : __dirname;

export const SAMPLE_DIR = ROOT_DIR + '/data/samples';
export const CACHE_DIR = ROOT_DIR + '/cache';
export const COMMON_DIR = ROOT_DIR + '/data/common';
export const LANG_DIR = ROOT_DIR + '/data/lang';
export const PARSER_DIR = ROOT_DIR + '/data/parser';
