var path = require('path');

module.exports = {
    entry: {
        "index": path.resolve(__dirname, './dist/esm/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/umd'),
        filename: '[name].js',
        library: 'patmat',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    }
};