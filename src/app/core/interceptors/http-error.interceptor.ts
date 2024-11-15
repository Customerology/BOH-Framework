import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';
import { HandleErrorBase } from './handle-error-base';

@Injectable()
export class HttpErrorInterceptor<T>
  extends HandleErrorBase
  implements HttpInterceptor
{
  constructor(
    snackBar: MatSnackBar,
    loadingOverlayService: LoadingOverlayService
  ) {
    super(snackBar, loadingOverlayService);
  }

  intercept(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }
}
