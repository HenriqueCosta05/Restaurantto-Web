import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PieChartOptions, PieMetrics } from '@domain/static/interfaces';

@Component({
    selector: 'app-pie',
    standalone: true,
    imports: [],
    templateUrl: './pie.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class PieComponent {
    constructor() {}
    @Input() options: PieChartOptions | undefined;
    @Input() metrics: PieMetrics | undefined;
    @Input() id: string | undefined;
}
