import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'banners', pathMatch: 'full' },
  {
    path: 'banners',
    loadChildren: () =>import('./modules/banners-module/banners.module').then((m) => m.BannersModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
