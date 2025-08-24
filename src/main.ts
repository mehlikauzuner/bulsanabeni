import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { authInterceptor } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const TR_DATE_FORMATS = {
  parse: { dateInput: 'DD.MM.YYYY' },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(TimepickerModule.forRoot()),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Sadece bu kalsın
    ),
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide: MAT_DATE_FORMATS, useValue: TR_DATE_FORMATS },
  ],
}).catch(err => console.error(err));
