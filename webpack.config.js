const path = require('path');
const SizePlugin = require('size-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	stats: 'errors-only',
	entry: {
		background: './src/background',
		'popup/popup': './src/popup/popup',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
		new SizePlugin(),
		new CopyPlugin({
      patterns: [
        {
          from: 'content/*',
          context: 'src',
        },
        {
          from: '**/*',
          context: 'src',
          globOptions: {
            ignore: ['*.js']
          },
        },
        {
          from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js'
        }
      ]
    }),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: true,
					output: {
						beautify: false,
					}
				}
			})
		]
	},
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    }
  }
};
