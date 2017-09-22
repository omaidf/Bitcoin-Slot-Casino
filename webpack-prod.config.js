const path = require('path');
const webpack = require('webpack');
module.exports = {
    context: path.resolve(__dirname, './src/app'),
    entry: {
        app: ['./index.js']
    },
    output: {
        path: path.resolve(__dirname, './src/dist'),
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            filename: 'app.bundle.js',
            minChunks: 2,
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        rules: [{
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react', 'stage-3']
                    },
                }],
            },
            {
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, './src'),
    }
};