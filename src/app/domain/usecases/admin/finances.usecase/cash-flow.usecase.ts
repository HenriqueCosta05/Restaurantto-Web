import { Injectable } from '@angular/core';
import { HttpUseCaseGateway } from '@infra/http/http-usecase-gateway';
import {
    DefaultResponseDto,
    PaginatedResponse,
    ListByPeriodResponse,
    CashFlowDto,
} from '@domain/dtos';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/shared';

@Injectable({
    providedIn: 'root',
})
export class CashFlowUseCase extends HttpUseCaseGateway<CashFlowDto> {
    public apiBase = API_URL;

    createCashFlow(
        data: CashFlowDto,
    ): Observable<ListByPeriodResponse<CashFlowDto>> {
        return this.listPerPeriod(
            `${this.apiBase}/api/financials/cash-flow`,
            data,
        );
    }
}
