import { NgModule, isDevMode } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ApiInterceptor } from './shared/interceptors/api-interceptor';
import { JwtInterceptor } from './shared/interceptors/jwt-interceptor';

import { StoreModule } from '@ngrx/store';
import { bannersReducer } from './modules/banners-module/store/banners.reducer';
import { BannersEffects } from './modules/banners-module/store/banners.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({
      banners: bannersReducer
     }),
    EffectsModule.forRoot(BannersEffects),
    StoreDevtoolsModule.instrument({logOnly: !isDevMode()})
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
