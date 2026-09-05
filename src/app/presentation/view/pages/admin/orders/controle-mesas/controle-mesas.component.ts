import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardList } from '@domain/static/interfaces';
import {
    ButtonComponent,
    CardListComponent,
    SidebarComponent,
} from '@presentation/view/components';

@Component({
    selector: 'app-controle-mesas',
    standalone: true,
    imports: [SidebarComponent, CardListComponent, ButtonComponent],
    templateUrl: './controle-mesas.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class ControleMesasComponent {
    private readonly _allCards = [
        {
            heading: 'Mesa 1',
            buttonText: 'Ver mais',
            link: '/admin/orders/controle-mesas/mesa-1',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 2',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 3',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 4',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 5',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 6',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 7',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
        {
            heading: 'Mesa 8',
            buttonText: 'Ver mais',
            link: '/',
            imgSrc: '../../../../../../assets/logo.svg',
        },
    ];

    cardListConfig: CardList = {
        filters: [
            { isActive: false, text: 'Todos' },
            { isActive: false, text: 'Em Andamento' },
            { isActive: false, text: 'Cancelados' },
        ],
        title: 'Últimos Pedidos',
        cards: this._allCards,
        search: {
            placeholder: 'Pesquise um prato por nome, ID ou categoria...',
            value: '',
            onSearch: (value: string): void => {
                this.cardListConfig.cards = value
                    ? this._allCards.filter((card) =>
                          card.heading
                              .toLowerCase()
                              .includes(value.toLowerCase()),
                      )
                    : this._allCards;
            },
        },
        pagination: {
            pageRange: 0,
            totalItems: 0,
        },
        rowOrder: [],
        metrics: '',
        header: [],
        data: [],
    };
}
