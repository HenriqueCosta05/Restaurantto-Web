import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { tokenInterceptorFn } from './security/token.interceptor';
import {
    provideHttpClient,
    withInterceptors,
    withXhr,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AUTH_GATEWAY, SESSION_GATEWAY } from '@domain/base';
import { HttpAuthGateway } from '@infra/http/http-auth.gateway';
import { HttpSessionGateway } from '@infra/security/http-session.gateway';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withXhr(), withInterceptors([tokenInterceptorFn])),
        provideAnimations(),
        provideToastr({
            timeOut: 5000,
            progressBar: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
        { provide: AUTH_GATEWAY, useClass: HttpAuthGateway },
        { provide: SESSION_GATEWAY, useClass: HttpSessionGateway },
    ],
};
