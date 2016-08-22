import { RouterConfig } from '@angular/router';

// Syncs
import { CORE } from './core/';

// Asyncs

const routes: RouterConfig = [
	...CORE._ROUTES,
];

let tmpAsyncRoutes: AsyncRoutes = { };
let tmpPrefetchRouteCallbacks: Array<IdleCallbacks> = [];

////////////////////////////////////// A-Syncs //////////////////////////////////////////
// importDependencies( CORE._ASYNC_ROUTE );

/////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////// A-Syncs //////////////////////////////////////////
// importDependenciesCallbacks( CORE._ROUTE_CALLBACK );

/////////////////////////////////////////////////////////////////////////////////////////

const asyncRoutes: AsyncRoutes = tmpAsyncRoutes;
const prefetchRouteCallbacks: Array<IdleCallbacks> = tmpPrefetchRouteCallbacks;

function importDependencies(obj: Object) {
	for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
					tmpAsyncRoutes[key] = obj[key];
			}
	}
}

function importDependenciesCallbacks(array: Array<IdleCallbacks> ) {
	for (let i = 0; i < array.length; i++) {
		tmpPrefetchRouteCallbacks.push(array[i]);
	}
}

export const ROUTING = {
	_ROUTES: routes,
	_ASYNC_ROUTE: asyncRoutes,
	_ROUTE_CALLBACK: prefetchRouteCallbacks
};
