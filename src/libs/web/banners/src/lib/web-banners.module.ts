import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { BannersRoutingModule } from './banners.routing-module';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DrawerPageComponent } from './pages/drawer/drawer.component';
import { BannerFormComponent } from './components/form/form.component';
import { BannersListComponent } from './components/list/list.component';

import { BannersEffects } from './store/effects/banners.effects';
import { bannersReducer } from './store/reducer/banners.reducer';

const components = [
  DrawerPageComponent,
  BannersListComponent,
  BannerFormComponent,
];

const angularMaterialModules = [
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatChipsModule,
  MatToolbarModule,
  MatToolbarModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    BannersRoutingModule,
    ReactiveFormsModule,
    angularMaterialModules,
    StoreModule.forFeature('banners', bannersReducer),
    EffectsModule.forFeature(BannersEffects),
  ],
})
export class WebBannersModule {}
