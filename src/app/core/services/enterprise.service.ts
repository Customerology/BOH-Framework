import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { APPLICATION_SELECTED_ENTERPRISE } from '../constants/app-constants';
import { EnterpriseModel } from '../models';
import { HttpService } from './http.service';

@Injectable()
export class EnterpriseService {
  private currentEnterpriseItem_$: BehaviorSubject<Partial<EnterpriseModel> | null> =
    new BehaviorSubject<Partial<EnterpriseModel> | null>(null);

  constructor(private httpService: HttpService) {}

  get currentEnterpriseActiveItem$(): Observable<Partial<EnterpriseModel> | null> {
    return this.currentEnterpriseItem_$
      .asObservable()
      .pipe(distinctUntilChanged());
  }

  setCurrentEnterpriseActiveItem(item: Partial<EnterpriseModel> | null): void {
    this.currentEnterpriseItem_$.next(item);
    localStorage.setItem(
      APPLICATION_SELECTED_ENTERPRISE,
      item ? JSON.stringify({ id: item.id, name: item.name }) : ''
    );
  }

  getAllEnterprises(useCache = false): Observable<EnterpriseModel[]> {
    return this.httpService
      .get<EnterpriseModel[]>('Enterprise', useCache)
      .pipe(map((res) => res || []));
  }

  get currentEnterpriseItemLS(): Partial<EnterpriseModel> | null {
    return JSON.parse(
      String(localStorage.getItem(APPLICATION_SELECTED_ENTERPRISE) || null)
    );
  }
}
