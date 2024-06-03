import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthReducer } from '../store/auth/auth.reducer';
import { AuthEffect } from '../store/auth/auth.effects';
import { provideHttpClient } from '@angular/common/http';
import { UtilsService } from './core/services/utils.servise';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ToasterService } from './core/services/toaster.service';
import { AppReducer } from '../store/app/app.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    UtilsService,
    ToasterService,
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ auth: AuthReducer, app: AppReducer }),
    provideEffects([AuthEffect]),
    provideToastr(),
    provideAnimations(),
  ],
};
