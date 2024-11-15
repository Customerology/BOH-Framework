import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';

@Injectable()
export class HttpLoadingInterceptor<T> implements HttpInterceptor {
  private serviceCount = 0;

  constructor(private loadingOverlayService: LoadingOverlayService) {}

  intercept(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    this.loadingOverlayService.setIsLoadingState(true);
    this.serviceCount++;

    return next.handle(request).pipe(
      finalize(() => {
        this.serviceCount--;
        if (this.serviceCount === 0) {
          this.loadingOverlayService.setIsLoadingState(false);
        }
      })
    );
  }
}
