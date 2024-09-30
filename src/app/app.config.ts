import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { HammerModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(MatSnackBarModule),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAnimationsAsync(),
    [importProvidersFrom(HammerModule)],
  ],
};
