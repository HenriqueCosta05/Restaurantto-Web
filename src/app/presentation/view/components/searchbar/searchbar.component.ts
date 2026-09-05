import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchbarConfig } from '@domain/static/interfaces';

@Component({
    selector: 'app-searchbar',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './searchbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class SearchbarComponent {
    @Input() searchBarConfig!: SearchbarConfig;

    onSearch(value: string): void {
        if (!value) return;
        this.searchBarConfig.value = value;
    }

    handleChange(value: string): void {
        this.searchBarConfig.value = value;
    }
}
