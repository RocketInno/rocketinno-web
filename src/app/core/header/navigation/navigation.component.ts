import { Component, Input } from '@angular/core';


@Component({
	selector: 'rocket-navigation',
	styleUrls: [ './navigation.styl' ],
	templateUrl: './navigation.html',
})
export class NavigationComponent {
	@Input() showMenu: boolean;
	constructor() {}
}
