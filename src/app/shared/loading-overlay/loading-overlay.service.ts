import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private isLoading_$ = new BehaviorSubject(false);

  get isLoading$(): Observable<boolean> {
    return this.isLoading_$.asObservable();
  }

  setIsLoadingState(isLoading: boolean): void {
    this.isLoading_$.next(isLoading);
  }
}
