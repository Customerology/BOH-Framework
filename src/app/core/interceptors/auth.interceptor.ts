import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

/**
 * A list of partial URLs to skip adding custom headers
 */
const URLsToSkip = ['LogonV2'];

/**
 * An interceptor to add X-Auth header to http requests automatically
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    if (URLsToSkip.some((s) => request.url.includes(s))) {
      request = request.clone({
        setHeaders: { 'X-Auth': environment.loginApiKey }
      });
    } else {
      if (this.authenticationService.userToken) {
        request = request.clone({
          setHeaders: { 'X-Auth': this.authenticationService.userToken }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.authenticationService.logout();
        }
        return throwError(err);
      })
    );
  }
}
