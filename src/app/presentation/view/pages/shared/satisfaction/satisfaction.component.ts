import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidebarComponent } from '@presentation/view/components';

@Component({
    selector: 'app-satisfaction',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './satisfaction.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class SatisfactionComponent {}
