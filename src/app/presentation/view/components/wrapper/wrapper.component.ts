import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-wrapper',
    standalone: true,
    imports: [],
    templateUrl: './wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class WrapperComponent {
    @Input() customClasses: string = '';
}
