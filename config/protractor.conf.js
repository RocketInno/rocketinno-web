require('ts-node/register');
var helpers = require('./helpers');



exports.config = {
	baseUrl: 'http://localhost:3000/',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	// chromeDriver: './selenium/chromedriver',

	// use `npm run e2e`
	specs: [
		helpers.root('src/**/**.e2e.ts'
		),
		helpers.root('src/**/*.e2e.ts')
	],
	exclude: [],

	framework: 'jasmine2',

	// allScriptsTimeout: 110000,

	jasmineNodeOpts: {
		showTiming: true,
		showColors: true,
		isVerbose: false,
		includeStackTrace: false,
		silent: true,
		defaultTimeoutInterval: 400000
	},

	directConnect: false,

	capabilities: {
		'browserName': 'chrome',
		'chromeOptions': {
			'args': ['show-fps-counter=true']
		}
	},

	// resultJsonOutputFile: './test-reports/report.json',

	beforeLaunch: function () {

	},
	onPrepare: function () {
		browser.ignoreSynchronization = false;


		var SpecReporter = require('jasmine-spec-reporter');
		jasmine.getEnv().addReporter(new SpecReporter());

		var jasmineReporters = require('jasmine-reporters');

		 jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			savePath: 'test-reports',
			filePrefix: 'e2e-test'
		}));

	},

	/**
	 * Angular 2 configuration
	 *
	 * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
	 * `rootEl`
	 */
	 useAllAngular2AppRoots: true
};
