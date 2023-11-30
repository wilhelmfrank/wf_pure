import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { httpInterceptorProviders } from './base/services/interceptors';
import { BASE_ROUTES } from './base/base.routes';
import { WfvsRrs } from './base/services/wfvs-rrs';
import { DialogModule } from '@angular/cdk/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(BASE_ROUTES),
    httpInterceptorProviders,
    {
      provide: RouteReuseStrategy,
      useClass: WfvsRrs
    },
    importProvidersFrom(DialogModule),
    provideHttpClient(withInterceptorsFromDi()),
  ]
};
