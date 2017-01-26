const { writeFile } = require('../utils/file-manager');

function template({ name, alias }) {
  return `
@font-face {
  font-family: ${name};
  font-style: normal;
  font-weight: 400;
  src: url('${alias}.woff') format('woff'),
    url('${alias}.ttf')  format('truetype');
}

.${alias} {
  font-family: ${name};
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: liga;
  overflow: hidden;
}

.${alias}.dp24 {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

.${alias}.dp36 {
  font-size: 36px;
  width: 36px;
  height: 36px;
}

.${alias}.dp48 {
  font-size: 48px;
  width: 48px;
  height: 48px;
}

.${alias}.inline {
  transform: translateY(-.1em);
}
`
}

async function write(font, filename) {
  const data = template(font);
  await writeFile(filename, data);
  return data;
}

module.exports = write;
