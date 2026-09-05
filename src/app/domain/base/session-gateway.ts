import { InjectionToken } from '@angular/core';

export interface SessionGateway {
    isLoggedIn(): boolean;
    logout(): void;
}

export const SESSION_GATEWAY = new InjectionToken<SessionGateway>(
    'SESSION_GATEWAY',
);
