import { NgClass } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '@presentation/view/components';

@Component({
    selector: 'app-section-layout',
    standalone: true,
    templateUrl: './section-layout.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ButtonComponent, NgClass],
})
export class SectionLayoutComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() buttonText: string = '';
    @Input() buttonLink: string = '';
    @Input() imageUrl: string = '';
    @Input() reverse: boolean = false;
}
