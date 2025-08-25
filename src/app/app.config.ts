import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';


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




export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    localStorage.getItem('token') ??
    localStorage.getItem('access_token');

  // Hangi isteğe takıldığını görmek için log
  // (istersen kaldırırsın, şimdilik dursun)
  console.log('[INT] →', req.method, req.url, 'token?', !!token);

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};


