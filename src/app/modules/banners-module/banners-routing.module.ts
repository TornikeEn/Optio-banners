import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BannersModuleComponent } from './banners-module.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    component: BannersModuleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BannersRoutingModule {}
