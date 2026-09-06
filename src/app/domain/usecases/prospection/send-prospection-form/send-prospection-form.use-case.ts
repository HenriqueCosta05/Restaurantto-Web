import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/shared';
import { map, Observable } from 'rxjs';
import { ProspectionDto, DefaultResponseDto } from '@domain/dtos';
import { HttpUseCaseGateway } from '@infra/http/http-usecase-gateway';

@Injectable({
    providedIn: 'root',
})
export class SendProspectionFormUseCase extends HttpUseCaseGateway<ProspectionDto> {
    public apiBase = API_URL;

    sendForm(data: ProspectionDto): Observable<DefaultResponseDto> {
        return this.create(`${this.apiBase}/api/users/prospects`, data);
    }
}
