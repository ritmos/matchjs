var path = require('path');

module.exports = {
    entry: {
        "index": path.resolve(__dirname, './dist/esm/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/umd'),
        filename: '[name].js',
        library: 'match', // name of the global object
        libraryTarget: 'umd',
        globalObject: 'this',
        libraryExport: 'match' // we expose the match function directly
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