const path = require('path');

module.exports = {
    mode: 'development',

    context: path.resolve(__dirname),

    // This has to be source-map as webexts cannot eval due to CSP
    devtool: process.env.NODE_ENV === 'production' || process.env.NOMAP === '1' ? 'none' : 'inline-source-map',

    target: 'web',

    entry: {
        background: './src/background/index.ts',
        content: './src/content/index.ts',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /\/node_modules\//,
            },
        ],
    },

    optimization: {
        minimize: false,
        splitChunks: false,
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: ['node_modules', path.resolve(__dirname, 'src')],
        alias: {
            '@background': path.resolve(__dirname, 'src', 'background'),
            '@content': path.resolve(__dirname, 'src', 'content'),
            '@src': path.resolve(__dirname, 'src'),
            '@tests': path.resolve(__dirname, 'tests'),
        },
    },
};
