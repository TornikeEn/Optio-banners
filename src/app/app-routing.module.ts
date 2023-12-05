import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'banners', pathMatch: 'full' },
  {
    path: 'banners',
    loadChildren: () =>import('../libs/web/banners/src/index').then((m) => m.WebBannersModule),
  },
  {
    path: '**', redirectTo: 'banners', pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
