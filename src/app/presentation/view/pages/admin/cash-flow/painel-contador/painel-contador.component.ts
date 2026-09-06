import { Location } from '@angular/common';
import {
    Component,
    AfterViewInit,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    DataItem,
    PieChartOptions,
    PieMetrics,
    TableConfig,
} from '@domain/static/interfaces';
import {
    ButtonComponent,
    CardComponent,
    SidebarComponent,
} from '@presentation/view/components';
import {
    LineColumnComponent,
    PieComponent,
} from '@presentation/view/components/chart';
import { ExpenseDto, RevenueDto, PaginatedResponse } from '@domain/dtos';
import ApexCharts from 'apexcharts';
import { TableComponent } from '../../../../components/table/table.component';
import { Subscription } from 'rxjs';
import { ExpensesUseCase, RevenuesUseCase } from '@domain/usecases';

@Component({
    selector: 'app-painel-contador',
    standalone: true,
    imports: [
        SidebarComponent,
        LineColumnComponent,
        CardComponent,
        TableComponent,
        PieComponent,
        ButtonComponent,
    ],

    templateUrl: './painel-contador.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: ``,
})
export class PainelContadorComponent implements OnInit, AfterViewInit {
    constructor(
        private location: Location,
        private _expensesUseCase: ExpensesUseCase,
        private _revenuesUseCase: RevenuesUseCase,
    ) {}

    subscription: Subscription | null = null;
    currentPage = 1;
    pageSize = 6;
    private _allRows: DataItem<{ valor: string; dataPagamento: string }>[] =
        [];

    ngOnInit(): void {
        this._fetchExpenses();
        this._fetchRevenues();
    }

    private _fetchExpenses(): void {
        this._expensesUseCase
            .getExpenses(this.currentPage - 1, this.pageSize)
            .subscribe((response: PaginatedResponse<ExpenseDto>) => {
                this.tabela.data = response.content.map(
                    (expense: ExpenseDto) => ({
                        rowData: {
                            valor: expense.amount.toString(),
                            dataPagamento: expense.paymentDate,
                        },
                        componentType: ['text', 'text'],
                    }),
                );
                this._allRows = this.tabela.data;
                this.tabela.pagination.totalItems = response.totalElements;
                this.tabela.pagination.totalPages = Math.ceil(
                    response.totalElements / this.pageSize,
                );
            });
    }

    private _fetchRevenues(): void {
        this._revenuesUseCase
            .getRevenues(this.currentPage - 1, this.pageSize)
            .subscribe((response: PaginatedResponse<RevenueDto>) => {
                this.tabela.data = response.content.map(
                    (revenue: RevenueDto) => ({
                        rowData: {
                            valor: revenue.amount.toString(),
                            dataPagamento: revenue.paymentDate,
                        },
                        componentType: ['text', 'text'],
                    }),
                );
                this._allRows = this.tabela.data;
                this.tabela.pagination.totalItems = response.totalElements;
                this.tabela.pagination.totalPages = Math.ceil(
                    response.totalElements / this.pageSize,
                );
            });
    }

    tabela: TableConfig<{
        valor: string;
        dataPagamento: string;
    }> = {
        rowOrder: ['valor', 'dataPagamento'],
        title: 'Ultimas Movimentações',
        filters: [
            { isActive: true, text: 'Últimos 30 dias' },
            { isActive: false, text: 'Últimos 60 dias' },
            { isActive: false, text: 'Últimos 90 dias' },
        ],
        metrics: '',
        header: ['Valor da finança', 'Data da Finança'],
        data: [],
        search: {
            placeholder: '',
            value: '',
            onSearch: (value: string): void => {
                this.tabela.data = value
                    ? this._allRows.filter(
                          (row) =>
                              row.rowData.valor
                                  .toLowerCase()
                                  .includes(value.toLowerCase()) ||
                              row.rowData.dataPagamento
                                  .toLowerCase()
                                  .includes(value.toLowerCase()),
                      )
                    : this._allRows;
            },
        },
        pagination: {
            pageRange: 0,
            totalItems: 0,
        },
    };

    metrics: PieMetrics = {
        title: '',
        dateRange: '08/10/2023 - 08/10/2024',
        options: [
            { href: '#', text: 'Exportar' },
            { href: '#', text: 'Compartilhar' },
        ],
    };
    data: PieChartOptions = {
        type: 'pie',
        series: [28, 72],
        colors: ['#740318', '#2E7D32'],
        chart: {
            height: '100%',
            width: '100%',
            type: 'pie',
        },
        stroke: {
            colors: ['white'],
            lineCap: '',
        },
        plotOptions: {
            pie: {
                labels: {
                    show: true,
                },
                size: '100%',
                dataLabels: {
                    offset: -25,
                },
            },
        },
        labels: ['Despesas', 'Receitas'],
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: 'DM Sans, sans-serif',
            },
        },
        legend: {
            position: 'bottom',
            fontFamily: 'DM Sans, sans-serif',
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + '%';
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value + '%';
                },
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
    };
    ngAfterViewInit(): void {
        const chartElement = document.getElementById('stock-chart');
        if (chartElement && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(
                chartElement,
                this.data as unknown as ApexCharts.ApexOptions,
            );
            chart.render();
        }
    }

    voltar() {
        this.location.back();
    }
}
