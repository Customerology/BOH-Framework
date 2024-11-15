import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { APPLICATION_SELECTED_LOCATION } from '../constants/app-constants';
import { EnterpriseLocationModel } from '../models/enterprise-location.model';
import { HttpService } from './http.service';

@Injectable()
export class EnterpriseLocationService {
  private currentEnterpriseLocationItem_$: BehaviorSubject<Partial<EnterpriseLocationModel> | null> =
    new BehaviorSubject<Partial<EnterpriseLocationModel> | null>(null);

  constructor(private httpService: HttpService) {}

  get currentEnterpriseLocationActiveItem$(): Observable<Partial<EnterpriseLocationModel> | null> {
    return this.currentEnterpriseLocationItem_$
      .asObservable()
      .pipe(distinctUntilChanged());
  }

  setCurrentEnterpriseLocationActiveItem(
    item: Partial<EnterpriseLocationModel> | null
  ): void {
    this.currentEnterpriseLocationItem_$.next(item);
    localStorage.setItem(
      APPLICATION_SELECTED_LOCATION,
      item ? JSON.stringify({ id: item.id, name: item.name }) : ''
    );
  }

  getLocationByEnterpriseId(
    id: number,
    useCache = true
  ): Observable<EnterpriseLocationModel[]> {
    return this.httpService
      .get<EnterpriseLocationModel[]>(`Enterprise/${id}/Location`, useCache)
      .pipe(map((res) => res || []));
  }

  get currentLocationItemLS(): Partial<EnterpriseLocationModel> | null {
    return JSON.parse(
      String(localStorage.getItem(APPLICATION_SELECTED_LOCATION) || null)
    );
  }
}
