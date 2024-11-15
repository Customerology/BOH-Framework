import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { HttpService } from './http.service';

@Injectable()
export class CategoryService {
  constructor(private httpService: HttpService) {}

  getCategoriesList(): Observable<CategoryModel[]> {
    return this.httpService
      .get<CategoryModel[]>(`Category/list`)
      .pipe(map((res) => res || []));
  }
}
