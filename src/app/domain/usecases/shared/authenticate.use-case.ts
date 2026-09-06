import { Inject, Injectable } from '@angular/core';
import { InputSendLoginFormDto, OutputSendLoginFormDto } from '@domain/dtos';
import { Observable } from 'rxjs';
import {
    AUTH_GATEWAY,
    AuthGateway,
    SESSION_GATEWAY,
    SessionGateway,
} from '@domain/base';

@Injectable({
    providedIn: 'root',
})
export class AuthenticateUseCase {
    constructor(
        @Inject(AUTH_GATEWAY) private _authGateway: AuthGateway,
        @Inject(SESSION_GATEWAY) private _sessionGateway: SessionGateway,
    ) {}

    sendCredentials(
        data: InputSendLoginFormDto,
    ): Observable<OutputSendLoginFormDto> {
        return this._authGateway.sendCredentials(data);
    }

    isLoggedIn(): boolean {
        return this._sessionGateway.isLoggedIn();
    }

    logout(): void {
        this._sessionGateway.logout();
    }
}
