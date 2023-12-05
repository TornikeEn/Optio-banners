import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawerPageComponent } from './pages/drawer/drawer.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    component: DrawerPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BannersRoutingModule {}
