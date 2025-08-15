import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';


const TR_DATE_FORMATS: MatDateFormats = {
  parse:   { dateInput: 'l' },
  display: {
    dateInput: 'd MMMM y',
    monthYearLabel: 'MMMM y',
    dateA11yLabel: 'd MMMM y',
    monthYearA11yLabel: 'MMMM y'
  }
};


registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'tr-TR' },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide: MAT_DATE_FORMATS, useValue: TR_DATE_FORMATS},

  ],
};