import { Injectable } from '@angular/core';
import { HttpUseCaseGateway } from '@infra/http/http-usecase-gateway';
import {
    DefaultResponseDto,
    PaginatedResponse,
    ListByPeriodResponse,
    RevenueDto,
    ExpenseDto,
} from '@domain/dtos';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/shared';

@Injectable({
    providedIn: 'root',
})
export class RevenuesUseCase extends HttpUseCaseGateway<RevenueDto> {
    public apiBase = API_URL;

    createRevenue(data: RevenueDto): Observable<RevenueDto> {
        return this.create(
            `${this.apiBase}/api/financials/create-revenue`,
            data,
        );
    }

    getRevenues(
        page: number,
        size: number,
    ): Observable<PaginatedResponse<RevenueDto>> {
        return this.getAll(
            `${this.apiBase}/api/financials/get-all-revenues`,
            page,
            size,
        );
    }

    getRevenueById(id: string): Observable<RevenueDto> {
        return this.getById(
            `${this.apiBase}/api/financials/get-revenue-by-id`,
            id,
        );
    }

    listRevenuesPerTime(
        timeRangePath: string,
    ): Observable<ListByPeriodResponse<RevenueDto>> {
        return this.listPerPeriod(
            `${this.apiBase}/api/financials/list-expenses-by-period`,
            { startDate: '', endDate: '' },
            timeRangePath,
        );
    }

    updateRevenue(id: string, data: RevenueDto): Observable<RevenueDto> {
        return this.update(
            `${this.apiBase}/api/financials/update-revenue`,
            data,
            id,
        );
    }

    deleteRevenue(id: string): Observable<RevenueDto> {
        return this.delete(`${this.apiBase}/api/financials/delete-revenue`, id);
    }
}
