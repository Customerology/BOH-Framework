import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, EMPTY, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';
import { AbstractCacheService } from './cache.service';

function trimSlashes(str: string) {
  return str.replace(/^\/+|\/+$/g, '');
}

interface RequestOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json' | never;
  withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(
    private http: HttpClient,
    private loadingOverlayService: LoadingOverlayService,
    private cacheService: AbstractCacheService<any>
  ) {}

  /**
   * @param path
   * @param useCache
   */
  get<T>(path: string, useCache = false): Observable<T> {
    const o$ = this.http.get<T>(this.url(path));
    const data$ = this.getData(path, useCache, o$);
    return defer(() => {
      return data$ || EMPTY;
    });
  }

  post<T>(
    path: string,
    body: unknown,
    useCache = false,
    o?: RequestOptions
  ): Observable<T> {
    const o$ = this.http.post<T>(this.url(path), body, o);
    const data$ = this.getData(path, useCache, o$);
    return defer(() => {
      return data$ || EMPTY;
    });
  }

  put<T>(path: string, body: unknown, o?: RequestOptions): Observable<T> {
    return defer(() => {
      return this.http.put<T>(this.url(path), body, o);
    });
  }

  delete(path: string, options?: RequestOptions): Observable<void> {
    return defer(() => {
      return this.http.delete<void>(this.url(path), options);
    });
  }

  private get endpoint(): string {
    return environment.apiURL;
  }

  private url(path: string): string {
    return `${this.endpoint}/${trimSlashes(path)}`;
  }

  private getData<T>(
    path: string,
    useCache = false,
    o$: Observable<T>
  ): Observable<any> | null {
    let data$ = useCache ? this.cacheService.getValue(path) : o$;
    if (useCache && !data$) {
      data$ = o$.pipe(shareReplay(1));
      this.cacheService.setValue(data$, path);
    }
    return data$;
  }
}
