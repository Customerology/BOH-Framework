import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  combineLatest,
  lastValueFrom,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APPLICATION_SIDEBAR_ACTIVE_ITEM_INDEX } from '../constants/app-constants';
import { routes } from '../../app-routing.module';
import { DynamicModuleWrapperComponent } from '../../components/dynamic-module-wrapper/dynamic-module-wrapper.component';
import { LoginModel } from '../models';
import { SidebarMenuItemModel } from '../models';
import { AuthenticationService } from './authentication.service';
import { EnterpriseLocationService } from './enterprise-location.service';
import { EnterpriseService } from './enterprise.service';
import { SidebarService } from './sidebar.service';

@Injectable()
export class AppInitService {
  private isReadyToRedirect = false;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private enterpriseService: EnterpriseService,
    private enterpriseLocationService: EnterpriseLocationService,
    private authenticationService: AuthenticationService
  ) {}

  async init(loginModel?: LoginModel): Promise<any> {
    this.isReadyToRedirect = !!loginModel?.appUser;
    const obs$ = combineLatest([
      this.sidebarService.getSidebarMenu(),
      this.enterpriseService.getAllEnterprises(true).pipe(
        tap((res) => {
          this.enterpriseService.setCurrentEnterpriseActiveItem(
            this.enterpriseService.currentEnterpriseItemLS || res[0]
          );
        })
      )
    ]);

    const isTokenExists = !!this.authenticationService.userToken;

    if (
      (location.pathname === '/login' && !this.isReadyToRedirect) ||
      !isTokenExists
    ) {
      this.authenticationService.logout();
      return await lastValueFrom(of(routes));
    }

    if (!!loginModel?.appUser || isTokenExists) {
      return await lastValueFrom(
        obs$.pipe(
          map(([sidebarData, enterprisesData]) => ({
            sidebarData,
            enterprisesData
          })),
          switchMap((res) =>
            res.enterprisesData.length
              ? this.enterpriseLocationService
                  .getLocationByEnterpriseId(
                    this.enterpriseService.currentEnterpriseItemLS?.id ||
                      res.enterprisesData[0].id
                  )
                  .pipe(
                    tap((res) => {
                      this.enterpriseLocationService.setCurrentEnterpriseLocationActiveItem(
                        this.enterpriseLocationService.currentLocationItemLS ??
                          res[0]
                      );
                    })
                  )
              : of(true)
          ),
          withLatestFrom(obs$),
          map(([locationsData, sidebarEnterprisesData]) => ({
            locationsData,
            sidebarData: sidebarEnterprisesData[0],
            enterprisesData: sidebarEnterprisesData[1]
          })),
          map((res) => {
            this.initializeRouting(res.sidebarData);
            return loginModel || routes;
          }),
          catchError(() => {
            return of([]);
          })
        )
      );
    } else {
      return await lastValueFrom(of(loginModel || routes));
    }
  }

  private initializeRouting(sidebarData: SidebarMenuItemModel[]): void {
    routes[0].children = [];
    routes[0].children.unshift({
      path: '',
      redirectTo: sidebarData.length
        ? sidebarData[APPLICATION_SIDEBAR_ACTIVE_ITEM_INDEX].route_
        : '/',
      pathMatch: 'full'
    });

    this.prepareRouting(sidebarData);

    this.router.resetConfig(routes);
  }

  private prepareRouting(data: SidebarMenuItemModel[]): void {
    data.forEach((o) => {
      routes[0].children!.push({
        path: o.route_,
        component: DynamicModuleWrapperComponent
      });

      if (o.subMenu?.length) {
        this.prepareRouting(o.subMenu);
      }
    });
  }
}
