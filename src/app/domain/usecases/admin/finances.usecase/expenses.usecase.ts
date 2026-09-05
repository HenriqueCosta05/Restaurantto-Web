import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUseCaseGateway } from '@infra/http/http-usecase-gateway';
import { ErrorService } from '@infra/http/error.service';
import {
    DefaultResponseDto,
    PaginatedResponse,
    ExpenseDto,
    ListByPeriodResponse,
    FinanceGroupDto,
} from '@domain/dtos';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/shared';

@Injectable({
    providedIn: 'root',
})
export class ExpensesUseCase extends HttpUseCaseGateway<ExpenseDto> {
    public apiBase = API_URL;

    constructor(_http: HttpClient, _errorService: ErrorService) {
        super(_http, _errorService);
    }

    createExpense(data: ExpenseDto): Observable<ExpenseDto> {
        return this.create(
            `${this.apiBase}/api/financials/create-expense`,
            data,
        );
    }

    getExpenses(
        page: number,
        size: number,
    ): Observable<PaginatedResponse<ExpenseDto>> {
        return this.getAll(
            `${this.apiBase}/api/financials/get-all-expenses`,
            page,
            size,
        );
    }

    getExpenseById(id: string): Observable<ExpenseDto> {
        return this.getById(
            `${this.apiBase}/api/financials/get-expense-by-id`,
            id,
        );
    }

    listExpensesPerTime(
        timeRangePath: string,
    ): Observable<ListByPeriodResponse<ExpenseDto>> {
        return this.listPerPeriod(
            `${this.apiBase}/api/financials/list-expenses-by-period`,
            { startDate: '', endDate: '' },
            timeRangePath,
        );
    }

    updateExpense(
        id: string,
        data: ExpenseDto
    ): Observable<ExpenseDto> {
        return this.update(`${this.apiBase}/api/financials/update-expense`, data, id);
}

deleteExpense(
    id: string
): Observable<ExpenseDto> {
        return this.delete(`${this.apiBase}/api/financials/delete-expense`, id)
}
}
