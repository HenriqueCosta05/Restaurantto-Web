import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthGateway } from '@domain/base';
import { InputSendLoginFormDto, OutputSendLoginFormDto } from '@domain/dtos';
import { API_URL } from 'src/app/shared';

@Injectable({
    providedIn: 'root',
})
export class HttpAuthGateway implements AuthGateway {
    public apiBase = API_URL;

    constructor(private _http: HttpClient) {}

    sendCredentials(
        data: InputSendLoginFormDto,
    ): Observable<OutputSendLoginFormDto> {
        return this._http
            .post<OutputSendLoginFormDto>(
                `${this.apiBase}/api/users/login`,
                data,
                {
                    observe: 'response',
                },
            )
            .pipe(
                map((response: HttpResponse<OutputSendLoginFormDto>) => {
                    const finalResponse: OutputSendLoginFormDto = {
                        statusCode: response.status,
                        token: response.body?.token,
                        id: response.body?.id,
                    };
                    return finalResponse;
                }),
                catchError((error) => {
                    return of({
                        statusCode: error.error.statusCode,
                        message: error.error.message,
                    });
                }),
            );
    }

    resetPassword(data: { newPassword: string }): Observable<unknown> {
        return this._http.post(
            `${this.apiBase}/api/users/update-password`,
            data,
        );
    }
}
