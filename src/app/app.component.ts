/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';

// Change the language from the beggining
import { LocalStorageService } from 'angular2-localstorage/LocalStorageEmitter';
import * as moment from 'moment';
/*
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'app',
	encapsulation: ViewEncapsulation.Emulated,
	styleUrls: ['./app.style.styl'],
	templateUrl: './app.component.html',
	providers: [ LocalStorageService ]
})
export class App {

	constructor(
		public storageService: LocalStorageService,
		public appState: AppState) {
		moment.locale('es');
	}

	ngOnInit() { }

}

