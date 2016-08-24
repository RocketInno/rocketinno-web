import { Component } from '@angular/core';

import { NavigationComponent } from './navigation';


@Component({
	selector: 'rocket-header',
	styleUrls: [ './header.styl' ],
	templateUrl: './header.html',
	directives: [NavigationComponent]
})
export class HeaderComponent {

	private showMenu: boolean;

	constructor() {}

	toggle() {
		this.showMenu = !this.showMenu;
	}
}
