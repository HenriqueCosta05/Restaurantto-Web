import { Injectable } from '@angular/core';
import { SessionGateway } from '@domain/base';
import { TokenService } from 'src/app/security/token.service';

@Injectable({
    providedIn: 'root',
})
export class HttpSessionGateway implements SessionGateway {
    constructor(private _tokenService: TokenService) {}

    isLoggedIn(): boolean {
        return this._tokenService.isTokenValid();
    }

    logout(): void {
        this._tokenService.removeToken();
    }
}
