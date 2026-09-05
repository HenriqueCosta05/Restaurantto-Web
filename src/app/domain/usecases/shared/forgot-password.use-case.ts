import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_GATEWAY, AuthGateway } from '@domain/base';

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordUseCase {
    constructor(@Inject(AUTH_GATEWAY) private _authGateway: AuthGateway) {}

    resetPassword(data: { newPassword: string }): Observable<unknown> {
        return this._authGateway.resetPassword(data);
    }
}
