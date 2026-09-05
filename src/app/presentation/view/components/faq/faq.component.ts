import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [],
    templateUrl: './faq.component.html',
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
