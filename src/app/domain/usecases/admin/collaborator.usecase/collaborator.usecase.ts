import { Injectable } from '@angular/core';
import { Observable, map, pipe } from 'rxjs';
import {
    CollaboratorDto,
    PaginatedResponse,
    ListByPeriodResponse,
    ListByPeriodDto,
    SupplierDto,
} from '@domain/dtos';
import { HttpUseCaseGateway } from '@infra/http/http-usecase-gateway';
import { COLLABORATOR_ENDPOINTS } from '@infra/http/endpoints';
import { API_URL } from '@shared/constants';

@Injectable({
    providedIn: 'root',
})
export class CollaboratorUseCase extends HttpUseCaseGateway<CollaboratorDto> {
    private apiBase = API_URL;

    getAllCollaborators(
        page: number,
        size: number,
    ): Observable<PaginatedResponse<CollaboratorDto>> {
        return this.getAll(
            `${this.apiBase}${COLLABORATOR_ENDPOINTS.getUsers}`,
            page,
            size,
        );
    }

    getCollaboratorById(id: string): Observable<CollaboratorDto> {
        return this.getById(
            `${this.apiBase}${COLLABORATOR_ENDPOINTS.getUsersById}`,
            id,
        );
    }

    registerCollaborator(data: CollaboratorDto): Observable<CollaboratorDto> {
        return this.create(
            `${this.apiBase}${COLLABORATOR_ENDPOINTS.createComplete}`,
            data,
        );
    }

    listCollaboratorsPerWeek(
        period?: ListByPeriodDto,
    ): Observable<ListByPeriodResponse<CollaboratorDto>> {
        const currentDate = new Date();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7);

        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = currentDate.toISOString().split('T')[0];

        if (period) {
            return this.listPerPeriod(
                `${this.apiBase}${COLLABORATOR_ENDPOINTS.listUsersByPeriodProducts}`,
                period,
                'groupingType=week',
            ).pipe(
                map(
                    (response: ListByPeriodResponse<CollaboratorDto>) =>
                        response,
                ),
            );
        }
        return this.listPerPeriod(
            `${this.apiBase}${COLLABORATOR_ENDPOINTS.listUsersByPeriod}`,
            { startDate: startDateString, endDate: endDateString },
            'groupingType=week',
        ).pipe(
            map((response: ListByPeriodResponse<CollaboratorDto>) => response),
        );
    }

    updateCollaborator(
        id: string,
        data: CollaboratorDto,
    ): Observable<CollaboratorDto> {
        return this.update(
            `${this.apiBase}${COLLABORATOR_ENDPOINTS.update}`,
            data,
            id,
        );
    }

    deleteCollaborator(id: string): Observable<CollaboratorDto> {
        return this.delete(
            `${this.apiBase}${COLLABORATOR_ENDPOINTS.delete}`,
            id,
        );
    }
}
