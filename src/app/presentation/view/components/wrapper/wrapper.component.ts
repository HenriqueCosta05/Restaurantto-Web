import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-wrapper',
    standalone: true,
    imports: [],
    templateUrl: './wrapper.component.html',
    styles: ``,
})
export class WrapperComponent {
    @Input() customClasses: string = '';
}
