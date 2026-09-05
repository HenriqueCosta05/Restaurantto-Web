import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [],
    templateUrl: './faq.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class FaqComponent {
    @Input() question: string = '';
    @Input() answer: string = '';

    isVisible: boolean = false;

    toggle() {
        this.isVisible = !this.isVisible;
    }
}
