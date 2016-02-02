require('babel-register')({
  sourceMaps: 'inline',
  presets: ['es2015', 'stage-0'],
});
require('babel-polyfill');
require('./electron/main');
