const svgicons2svgfont = require('svgicons2svgfont');
const fs = require('fs');
const path = require('path');

const myfs = require('../utils/fs');

class SVGFontWriter {

  constructor(fontface) {
    this.fontface = fontface;
  }

  write(filename) {
    return myfs.mkdir(path.dirname(filename)).then(() => {
      const warns = new Set();

      const stream = svgicons2svgfont({
        fontName: this.fontface.name,
        fontHeight: 150,
        normalize: true,
        // fixedWidth: false,
        log: (message) => {
          if (message !== 'Font created') {
            warns.add(message);
          }
        },
      });

      stream.pipe(fs.createWriteStream(filename, {
        flags: 'w',
        defaultEncoding: 'utf8',
      }));

      let svg = '';

      const promise = new Promise((resolve, reject) => {
        stream
          .on('data', (data) => {
            svg += data;
          })
          .on('end', () => {
            if (warns.size) {
              console.warn(Array.from(warns).join('\n'));
            }
            return resolve(svg);
          })
          .on('error', err => reject(err));
      });

      this.fontface.glyphs.forEach(({
        file,
        name,
        unicode,
      }) => {
        const glyph = fs.createReadStream(file);
        glyph.metadata = {
          name,
          unicode,
        };

        stream.write(glyph);
      });

      stream.end();

      return promise;
    });
  }
}

module.exports = SVGFontWriter;
