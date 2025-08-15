import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));



