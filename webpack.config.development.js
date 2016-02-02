/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const baseConfig = require('./webpack.config.base');

const config = Object.create(baseConfig);

config.debug = true;

config.devtool = 'cheap-module-eval-source-map';

config.entry = [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    './app/index'
];

config.output.publicPath = 'http://localhost:3000/dist/';

config.module.loaders = config.module.loaders.concat([
    {
        test: /\.css$/,
        loaders: [
            'style-loader',
            'css-loader'
        ]
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
    }
]);

config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        '__DEV__': true,
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    })
);

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
