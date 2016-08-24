import { Component } from '@angular/core';

import { HeaderComponent } from '../header/';

@Component({
	selector: 'rocket-home',
	styleUrls: [ './home.styl' ],
	templateUrl: './home.html',
	directives: [HeaderComponent]
})
export class HomeComponent {
	constructor() {}
}
