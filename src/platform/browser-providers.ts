/*
 * These are globally available services in any component or any other service
 */

// Angular 2
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
// Angular 2 Http
import { HTTP_PROVIDERS } from '@angular/http';
// Angular 2 Router
import { provideRouter } from '@angular/router';
// Angular 2 forms
import { disableDeprecatedForms, provideForms } from '@angular/forms';

// AngularClass
import { provideWebpack } from '@angularclass/webpack-toolkit';
import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';


import { ROUTING } from '../app/app.routes';
import { APP_RESOLVER_PROVIDERS } from '../app/app.resolver';
/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
	// new Angular 2 forms
	disableDeprecatedForms(),
	provideForms(),

	...APP_RESOLVER_PROVIDERS,

	provideRouter(ROUTING._ROUTES),
	provideWebpack(ROUTING._ASYNC_ROUTE),
	providePrefetchIdleCallbacks(ROUTING._ROUTE_CALLBACK),

	...HTTP_PROVIDERS,

	{ provide: LocationStrategy, useClass: PathLocationStrategy }
	// { provide: LocationStrategy, useClass: HashLocationStrategy }
];

export const PROVIDERS = [
	...APPLICATION_PROVIDERS
];
