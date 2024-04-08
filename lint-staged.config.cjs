/**
 * lint-staged：本地暂存代码检查工具
 * git commit 之前，会自动使用 prettier 格式化 ignore 之外的代码。
 * 格式化后，自动检查所有文件，是否全部符合 eslint 规范。存在不符合规范的代码，git commit 将被终止。
 */
module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": ["prettier --write--parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write", "stylelint --fix"],
  "*.{scss,less,styl,html}": ["stylelint --fix", "prettier --write"],
  "*.md": ["prettier --write"]
};
