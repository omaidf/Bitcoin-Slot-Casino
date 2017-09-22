const path = require('path');
const webpack = require('webpack');
module.exports = {
    context: path.resolve(__dirname, './src/app'),
    entry: {
        app: ['./index.js']
    },
    output: {
        path: path.resolve(__dirname, './src/dist'),
        filename: '[name].bundle.js'
    },
    devtool: "#eval-source-map",
    plugins: [
        new webpack
            .optimize
            .CommonsChunkPlugin({name: 'app', filename: 'app.bundle.js', minChunks: 2}),
        new webpack.LoaderOptionsPlugin({debug: true})
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                //exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react', 'stage-3']
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false']
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './src')
    }
};
