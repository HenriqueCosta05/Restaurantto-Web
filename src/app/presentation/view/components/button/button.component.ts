import { NgClass } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [NgClass],
    templateUrl: './button.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class ButtonComponent {
    @Input() link: string | undefined = '';
    @Input() class: string = '';
    @Input() disabled: boolean = false;

    @Output() handlePropertyChange = new EventEmitter<{
        key: string;
        value: unknown;
    }>();

    setContent = (key: string, value: unknown): void => {
        this.handlePropertyChange.emit({ key, value });
    };
}
