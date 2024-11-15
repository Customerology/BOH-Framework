import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { from, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  APPLICATION_SELECTED_ENTERPRISE,
  APPLICATION_SELECTED_LOCATION,
  APPLICATION_USER_OBJECT_NAME
} from '../constants/app-constants';
import { HandleErrorBase } from '../interceptors/handle-error-base';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';
import { AppUserModel, LoginModel, toHttpErrorResponse } from '../models';
import { AppInitService } from './app-init.service';
import { AbstractCacheService } from './cache.service';
import { HttpService } from './http.service';
import { SidebarService } from './sidebar.service';
import { LoginDetailModel } from '../models/login-detail.model';

function prepareUserObjectData(data: AppUserModel): Partial<AppUserModel> {
  return (({
    api_key,
    api_key_expiresOn,
    emailAddress,
    firstName,
    lastName,
    userName,
    login_details
  }) => ({
    api_key,
    api_key_expiresOn,
    emailAddress,
    firstName,
    lastName,
    userName,
    login_details
  }))(data);
}

@Injectable()
export class AuthenticationService extends HandleErrorBase {
  constructor(
    private httpService: HttpService,
    private injector: Injector,
    private router: Router,
    private sidebarService: SidebarService,
    private cacheService: AbstractCacheService<any>,
    snackBar: MatSnackBar,
    loadingOverlayService: LoadingOverlayService
  ) {
    super(snackBar, loadingOverlayService);
  }

  get userObjectFromStorage(): AppUserModel | null {
    const obj = String(localStorage.getItem(APPLICATION_USER_OBJECT_NAME));
    const parsedUserObject = this.validateJson<AppUserModel>(obj);
    if (parsedUserObject) {
      return parsedUserObject;
    } else {
      return null;
    }
  }

  get applicationUUID(): string {
    return environment.APP_UUID;
  }

  get userToken(): string | undefined {
    return this.userObjectFromStorage?.api_key;
  }

  getAppBasedUserToken(app_uuid: string | undefined): string | undefined {
    let login: LoginDetailModel | undefined;

    if (
      this.userObjectFromStorage != null &&
      this.userObjectFromStorage.login_details != null
    )
      login = this.userObjectFromStorage.login_details.find(
        (i) => i.app_uuid === app_uuid
      );
    if (login != null && login.key_generated != null)
      return login?.key_generated;
    return this.userObjectFromStorage?.api_key;
  }

  authorize(reqData: {
    userName: string;
    user_Pwd: string;
  }): Observable<LoginModel> {
    const appInitService = this.injector.get(AppInitService);
    return this.httpService
      .post<LoginModel>(`AppUser/LogonV2/app/${this.applicationUUID}`, reqData)
      .pipe(
        tap((res) => {
          return res.appUser
            ? localStorage.setItem(
                APPLICATION_USER_OBJECT_NAME,
                JSON.stringify(prepareUserObjectData(res.appUser))
              )
            : this.handleError(toHttpErrorResponse(res.error));
        }),
        switchMap((loginModel) => from(appInitService.init(loginModel)))
      );
  }

  logout(): void {
    localStorage.removeItem(APPLICATION_USER_OBJECT_NAME);
    localStorage.removeItem(APPLICATION_SELECTED_ENTERPRISE);
    localStorage.removeItem(APPLICATION_SELECTED_LOCATION);
    this.cacheService.clearCache();
    this.router.navigate(['login']).then();
  }

  private validateJson<T>(jsonStringToParse: string): T | null {
    let parsed: T;
    try {
      parsed = JSON.parse(jsonStringToParse);
    } catch (e) {
      console.info('string is not in JSON format.');
      return null;
    }
    return parsed;
  }
}
