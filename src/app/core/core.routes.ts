import { RouterConfig } from '@angular/router';


// Syncs
import { NoContentComponent } from './404';
import { HomeComponent } from './home/';

const routes: RouterConfig = [

	// DEFAULT or 404 not found
	{ path: '**', component: HomeComponent },
];


export const CORE = {
	_ROUTES: routes
};
