import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { InputSendLoginFormDto, OutputSendLoginFormDto } from '@domain/dtos';

export interface AuthGateway {
    sendCredentials(
        data: InputSendLoginFormDto,
    ): Observable<OutputSendLoginFormDto>;
    resetPassword(data: { newPassword: string }): Observable<unknown>;
}

export const AUTH_GATEWAY = new InjectionToken<AuthGateway>('AUTH_GATEWAY');
