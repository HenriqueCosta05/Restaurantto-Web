import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
    ButtonComponent,
    CardComponent,
    SidebarComponent,
} from '@presentation/view/components';
import { FinanceGroupUsecase } from '@domain/usecases';
import {
    FinanceGroupDto,
    ListByPeriodResponse,
    PaginatedResponse,
} from '@domain/dtos';
import { API_URL } from '@shared/constants';

interface CardData {
    title: string;
    link: string;
}

@Component({
    selector: 'app-financas',
    standalone: true,
    imports: [SidebarComponent, CardComponent, ButtonComponent],
    templateUrl: './financas.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class FinancasComponent implements OnInit {
    constructor(private _financeGroupUseCase: FinanceGroupUsecase) {}

    apiBase = API_URL;

    cards: CardData[] = [];

    private _fetchGroupsFromApi() {
        return this._financeGroupUseCase
            .getFinanceGroups()
            .subscribe((response: PaginatedResponse<FinanceGroupDto>) => {
                this.cards = response.content.map((data) => ({
                    title: data.name,
                    link: `/admin/controle-caixa/financas/grupo-financas/${data.id}`,
                }));
            });
    }

    ngOnInit(): void {
        this._fetchGroupsFromApi();
    }
}
