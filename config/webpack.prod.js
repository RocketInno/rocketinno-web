const webpack = require('webpack');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

/**
	* Webpack Plugins
*/
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

/**
	* Webpack Constants
*/
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const METADATA = webpackMerge(commonConfig.metadata, {
	ENV: ENV,
	HMR: false
});

module.exports = webpackMerge(commonConfig,
	{
		debug: false,
		output: {
			path: METADATA.paths.build, //helpers.root('dist'),
			filename: '[name].[chunkhash].bundle.js',
			sourceMapFilename: '[name].[chunkhash].bundle.map',
			chunkFilename: 'chunk.[id].[chunkhash].js'
		},
		plugins: [

			/**
				* Plugin: CleanWebpackPlugin
				* Description: Clean the dist directory
				*
			*/
			new CleanWebpackPlugin([METADATA.paths.build], {
				root: process.cwd()
			}),

			/**
				* Plugin: WebpackMd5Hash
				* Description: Plugin to replace a standard webpack chunkhash with md5.
				*
			*/
			new WebpackMd5Hash(),

			/**
				* Plugin: DedupePlugin
				* Description: Prevents the inclusion of duplicate code into your bundle
				* and instead applies a copy of the function at runtime.
				*
			*/
			new webpack.optimize.DedupePlugin(),


			/**
				* Plugin: DefinePlugin
				* Description: Define free variables.
				* Useful for having development builds with debug logging or adding global constants.
				*
				* Environment helpers
				*
			*/
			// NOTE: when adding more properties make sure you include them in custom-typings.d.ts
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
				* Plugin: UglifyJsPlugin
				* Description: Minimize all JavaScript output of chunks.
				* Loaders are switched into minimizing mode.
				*
			*/
			new webpack.optimize.UglifyJsPlugin({
				beautify: false,
				comments: false,
				mangle: { screw_ie8 : true },
				compress: {
					screw_ie8: true,
					warnings: false,
					drop_console: true
				}
			}),

			/**
				* Plugin: NormalModuleReplacementPlugin
				* Description: Replace resources that matches resourceRegExp with newResource
				*
			*/
			new NormalModuleReplacementPlugin(
				/angular2-hmr/,
				helpers.root('config/modules/angular2-hmr-prod.js')
			),

			/**
				* Plugin: IgnorePlugin
				* Description: Don’t generate modules for requests matching the provided RegExp.
				*
			*/
			//new webpack.IgnorePlugin(/angular2-hmr/),

		],

		/**
			* Static analysis linter for TypeScript advanced options configuration
			* Description: An extensible linter for the TypeScript language.
			*
		*/
		tslint: {
			emitErrors: true,
			failOnHint: true,
			resourcePath: 'src'
		},

		/**
			* Html loader advanced options
			*
		*/
		// TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
		htmlLoader: {
			minimize: true,
			removeAttributeQuotes: false,
			caseSensitive: true,
			customAttrSurround: [
				[/#/, /(?:)/],
				[/\*/, /(?:)/],
				[/\[?\(?/, /(?:)/]
			],
			customAttrAssign: [/\)?\]?=/]
		},

		/*
			* Include polyfills or mocks for various node stuff
			* Description: Node configuration
			*
		*/
		node: {
			global: 'window',
			crypto: 'empty',
			process: false,
			module: false,
			clearImmediate: false,
			setImmediate: false
		}
	}
);
