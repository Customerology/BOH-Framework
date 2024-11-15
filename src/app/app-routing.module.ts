import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RootComponent } from './components/root/root.component';
import { AppInitService } from './core/services/app-init.service';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
    pathMatch: 'full'
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./components/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
    data: { breadcrumb: 'Not found', title: 'Not found' }
  },
  { path: '**', redirectTo: '/not-found' }
];

function sidebarServiceFactory(appInitService: AppInitService) {
  return () => appInitService.init();
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: sidebarServiceFactory,
      deps: [AppInitService],
      multi: true
    }
  ]
})
export class AppRoutingModule {}
