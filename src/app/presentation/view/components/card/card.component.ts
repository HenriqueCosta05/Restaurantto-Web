import { NgClass } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [NgClass, ButtonComponent],
    templateUrl: './card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class CardComponent {
    @Input() isDemographic: boolean = false;
    @Input() hasRedirection: boolean = false;
    @Input() iconClass: string = '';
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() percentageChange: number = 0;
    @Input() isPositive: boolean = false;
    @Input() metricTitle: string = '';
    @Input() metric: number | string = 0;
    @Input() link: string = '';
    @Input() buttonText: string = '';
    @Input() imgSrc: string = '';

    @Output() handlePropertyChange = new EventEmitter<{
        key: string;
        value: unknown;
    }>();

    setContent = (key: string, value: unknown): void => {
        this.handlePropertyChange.emit({ key, value });
    };
}
