const helpers = require('./helpers');
const watcher = helpers.hasProcessFlag('watcher');

module.exports = function (config) {
	var testWebpackConfig = require('./webpack.test.js');

	config.set({

		// base path that will be used to resolve all patterns (e.g. files, exclude)
		basePath: '',

		frameworks: ['jasmine'],

		// list of files to exclude
		exclude: [],
		/*
		 * list of files / patterns to load in the browser
		 *
		 * we are building the test environment in ./spec-bundle.js
		 */
		files: [ { pattern: './config/spec-bundle.js', watched: false } ],

		/*
		 * preprocess matching files before serving them to the browser
		 * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		 */
		preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

		// Webpack Config at ./webpack.test.js
		webpack: testWebpackConfig,

		// Webpack please don't spam the console when running in karma!
		webpackServer: { noInfo: true },

		/*
		 * test results reporter to use
		 *
		 * possible values: 'dots', 'progress'
		 * available reporters: https://npmjs.org/browse/keyword/karma-reporter
		 */
		reporters: ['mocha', 'junit', 'coverage', 'karma-remap-istanbul'],

		junitReporter: {
			outputDir: './test-reports',
			outputFile: 'unit-test.xml',
			useBrowserName: false
		},
		coverageReporter: {
			dir: 'coverage/',
			reporters: [
				{ type: 'json',  dir: 'coverage/', subdir: '.', file: 'coverage-final.json' },
				{ type: 'lcovonly', dir: 'coverage/', subdir: '.' },
				{ type: 'text-summary' }
			],
			instrumenterOptions: {
				istanbul: { noCompact: true }
			}
		},

		/**
		 * Map code coverage result back to TypeScript using `karma-remap-istanbul`.
		 */
		remapIstanbulReporter: {
				src: 'coverage/coverage-final.json',
				reports: {
						// lcovonly: 'coverage/lcov.info',
						html: 'coverage/report'
				},
				timeoutNotCreated: 5000,
				timeoutNoMoreFiles: 1000
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		/*
		 * level of logging
		 * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		 */
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: watcher,

		/*
		 * start these browsers
		 * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		 */
		browsers: [
			// 'Chrome',
			'PhantomJS'
		],

		/*
		 * Continuous Integration mode
		 * if true, Karma captures browsers, runs the tests and exits
		 */
		singleRun: !watcher
	});

};
