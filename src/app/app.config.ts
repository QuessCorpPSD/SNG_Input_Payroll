import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { provideRouter,  withHashLocation } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideToastr(),
    provideHttpClient(withFetch()),
    importProvidersFrom(HttpClientModule),    
    provideClientHydration(),        
    importProvidersFrom(BrowserAnimationsModule)
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initBackground,
    //   deps: [BackgroundCheckService],
    //   multi: true
    // },
    
  ]
};
