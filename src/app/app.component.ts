import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { services } from '@domain/static/services';
import {
    FooterComponent,
    NavbarComponent,
} from '@presentation/view/components';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NavbarComponent, FooterComponent, RouterOutlet],
    providers: [...services],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './app.component.html',
})
export class AppComponent {}
