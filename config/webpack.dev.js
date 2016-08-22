const webpack = require('webpack');
const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js');

/**
 * Webpack Plugins
*/
const webpackMerge = require('webpack-merge');

/**
 * Webpack Constants
*/
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';


const METADATA = webpackMerge(commonConfig.metadata, {
	ENV: ENV,
	HMR: true
});

/**
 * Webpack configuration
*/
module.exports = webpackMerge(commonConfig, {
	metadata: METADATA,
	debug: true,
	devtool: 'cheap-module-source-map',
	output: {
		path: METADATA.paths.build,
		filename: '[name].bundle.js',
		sourceMapFilename: '[name].map',
		chunkFilename: '[id].chunk.js',
		library: 'ac_[name]',
		libraryTarget: 'var',
	},

	/**
		* Webpack Development Server configuration
		* Description: The webpack-dev-server is a little node.js Express server.
		* The server emits information about the compilation state to the client,
		* which reacts to those events.
		*
	*/
	devServer: {
		port: METADATA.port,
		host: METADATA.host,
		historyApiFallback: true,
		inline: true,
		hot: METADATA.HMR,
		stats: {
			colors:true,
			hash: false,
			version: false,
			timings: false,
			assets: false,
			chunks: false,
			modules: false,
			reasons: false,
			children: false,
			source: false,
			errors: true,
			errorDetails: false,
			warnings: true,
			publicPath: true
		},
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		outputPath: METADATA.paths.build
	},

	plugins: [
		/**
			* Plugin: DefinePlugin
			* Description: Define free variables.
			* Useful for having development builds with debug logging or adding global constants.
			*
			* Environment helpers
			*
		*/
		// NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
		new webpack.DefinePlugin({
			'ENV': JSON.stringify(METADATA.ENV),
			'HMR': METADATA.HMR,
			'process.env': {
				'ENV': JSON.stringify(METADATA.ENV),
				'NODE_ENV': JSON.stringify(METADATA.ENV),
				'HMR': METADATA.HMR,
			}
		}),

	/**
		* Webpack Development Server HMR configuration
		* Description: The Hot module replacement allows to refresh without reload the page
		*
	*/
		new webpack.HotModuleReplacementPlugin({
			multiStep: true
		})
	],

	/**
		* Static analysis linter for TypeScript advanced options configuration
		* Description: An extensible linter for the TypeScript language.
		*
	*/
	tslint: {
		emitErrors: false,
		failOnHint: false,
		resourcePath: 'src'
	},

	/*
	 * Include polyfills or mocks for various node stuff
	 * Description: Node configuration
	 *
	 * See: https://webpack.github.io/docs/configuration.html#node
	*/
	node: {
		global: 'window',
		crypto: 'empty',
		process: true,
		module: false,
		clearImmediate: false,
		setImmediate: false
	}

}
);
