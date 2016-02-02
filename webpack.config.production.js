/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const baseConfig = require('./webpack.config.base');

const config = Object.create(baseConfig);

config.devtool = 'source-map';

config.entry = './app/index';

config.output.publicPath = '../dist/';

config.module.loaders = config.module.loaders.concat([
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
            'style-loader',
            'css-loader'
        )
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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        '__DEV__': false,
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            screw_ie8: true,
            warnings: false
        }
    }),
    new ExtractTextPlugin('style.css', { allChunks: true })
);

config.target = webpackTargetElectronRenderer(config);

module.exports = config;
