const webpack = require('webpack');
const helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');

const poststylus = require('poststylus');

/*
 * Webpack Constants
 */
const PATHS = {
	app: helpers.root('src'),
	build: helpers.root('dist')
};

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;


const METADATA = {
	title: 'RocketInno',
	baseUrl: '/',
	isDevServer: helpers.isWebpackDevServer(),
	paths: PATHS,
	host: HOST,
	port: PORT
};

/*
 * Webpack configuration
 *
 */
module.exports = {
	metadata: METADATA,
	/*
	 * Cache generated modules and chunks to improve performance for multiple incremental builds.
	 * This is enabled by default in watch mode.
	 * You can pass false to disable it.
	 *
	 * See: http://webpack.github.io/docs/configuration.html#cache
	 */
	 //cache: false,

	entry: {
		'polyfills': PATHS.app + '/polyfills.browser.ts',
		'vendor':    PATHS.app + '/vendor.browser.ts',
		'main':      PATHS.app + '/main.browser.ts',
		'style':     PATHS.app + '/main.styl'
	},
	resolve: {
		extensions: ['', '.ts', '.js', '.json', '.styl'],
		root:  PATHS.app,
		modulesDirectories: ['node_modules'],
	},
	module: {
		preLoaders: [
			/*
				* Tslint loader support for *.ts files
				*
			*/
			{ test: /\.ts$/, loader: 'tslint-loader', exclude: [ helpers.root('node_modules') ] },

			/*
				* Source map loader support for *.js files
				* Extracts SourceMaps for source files that as added as sourceMappingURL comment.
				*
			*/
			{
				test: /\.js$/,
				loader: 'source-map-loader',
				exclude: [
					// these packages have problems with their sourcemaps
					helpers.root('node_modules/rxjs'),
					helpers.root('node_modules/@angular'),
					helpers.root('node_modules/@ngrx'),
					helpers.root('node_modules/@angular2-material'),
				]
			}

		],

		/*
			* An array of automatically applied loaders.
			*
			* IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
			* This means they are not resolved relative to the configuration file.
			*
		*/
		loaders: [
			/*
			 * Typescript loader support for .ts and Angular 2 async routes via .async.ts
			 *
			*/
			{
				test: /\.ts$/,
				loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
				exclude: [/\.(spec|e2e)\.ts$/]
			},

			/*
				* Json loader support for *.json files.
				*
			*/
			{
				test: /\.json$/,
				loader: 'json-loader'
			},

			/*
				* to string and css loader support for *.css files
				* Returns file content as string
				*
			*
			{
				test: /\.css$/,
				loaders: ['to-string-loader', 'css-loader']
			},
			*/

				{
					test: /\.styl$/,
					loaders: ['to-string-loader','css-loader', 'stylus-relative-loader'],
					exclude: [/node_modules/, helpers.root('src/main.styl')],
					include: PATHS.app
				},

				{
					test: /\.(woff|woff2|eot|ttf|svg)$/,
					exclude: /node_modules/,
					loader: 'url-loader?limit=100000&name=[name].[ext]'
				},

				{
					test: /\.styl$/,
					loader: ExtractTextPlugin.extract('style-loader','css-loader!stylus-loader'),
					exclude: [/node_modules/],
					include: helpers.root('src/main.styl')
				},

				// {
				// 	test: /\.css$/,
				// 	loader: ExtractTextPlugin.extract('style-loader','css-loader?sourceMap!'),
				// 	include: ['/node_modules/']
				// },

			/*
				* Raw loader support for *.html
				* Returns file content as string
				*
			*/
			{
				test: /\.html$/,
				loader: 'raw-loader',
				exclude: [helpers.root('src/index.html')]
			}

		]

	},

	stylus: {
		use: [
			require('nib')()
			// poststylus([ 'normalize', 'reset.css', 'flexboxgrid', 'autoprefixer' ])
			// postcss([ 'normalize', 'reset.css', 'flexboxgrid', 'autoprefixer' ])
		],
		import: ['~nib/lib/nib/index.styl']
	},

	plugins: [
		new ExtractTextPlugin('[name].[chunkhash].css'),
		/*
			* Plugin: ForkCheckerPlugin
			* Description: Do type checking in a separate process, so webpack don't need to wait.
			*
		*/
		new ForkCheckerPlugin(),

		/*
			* Plugin: OccurenceOrderPlugin
			* Description: Varies the distribution of the ids to get the smallest id length
			* for often used ids.
			*
		*/
		new webpack.optimize.OccurenceOrderPlugin(true),
		/*
			* Plugin: CommonsChunkPlugin
			* Description: Shares common code between the pages.
			* It identifies common modules and put them into a commons chunk.
			*
		*/
		new webpack.optimize.CommonsChunkPlugin({
			name: ['polyfills', 'vendor'].reverse()
		}),

		/*
			* Plugin: CopyWebpackPlugin
			* Description: Copy files and directories in webpack.
			*
			* Copies project static assets.
			*
		*/
		new CopyWebpackPlugin([{
			from: 'src/assets',
			to: 'assets',
			ignore: '*.styl'
		}]),

		/*
			* Plugin: HtmlWebpackPlugin
			* Description: Simplifies creation of HTML files to serve your webpack bundles.
			* This is especially useful for webpack bundles that include a hash in the filename
			* which changes every compilation.
			*
		*/
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			chunksSortMode: 'dependency',
			cache: true
			//hash: true
		}),

		/*
			* Plugin: HtmlHeadConfigPlugin
			* Description: Generate html tags based on javascript maps.
			*
			* If a publicPath is set in the webpack output configuration, it will be automatically added to
			* href attributes, you can disable that by adding a "=href": false property.
			* You can also enable it to other attribute by settings "=attName": true.
			*
			* The configuration supplied is map between a location (key) and an element definition object (value)
			* The location (key) is then exported to the template under then htmlElements property in webpack configuration.
			*
			* Example:
			*  Adding this plugin configuration
			*  new HtmlElementsPlugin({
			*    headTags: { ... }
			*  })
			*
			*  Means we can use it in the template like this:
			*  <%= webpackConfig.htmlElements.headTags %>
			*
			* Dependencies: HtmlWebpackPlugin
		*/
		new HtmlElementsPlugin({
			headTags: require('./head-config.common')
		}),

	],

		/*
			* Include polyfills or mocks for various node stuff
			* Description: Node configuration
			*
		*/
		node: {
			global: 'window',
			crypto: 'empty',
			module: false,
			clearImmediate: false,
			setImmediate: false
		}
};
