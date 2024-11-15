import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SidebarMenuItemModel } from '../models';
import { HttpService } from './http.service';

function formatString(string: string): string {
  return string.replace(/ /g, '').replace(/[^\w\s]/gi, '');
}

function formatSideMenuData(
  data: SidebarMenuItemModel[],
  parent?: string
): SidebarMenuItemModel[] {
  return data.map((o) => {
    const titleFormatted = formatString(o.title);
    const titleFormattedToLowerCase = titleFormatted.toLowerCase();
    return {
      ...o,
      subMenu: o.subMenu?.length
        ? formatSideMenuData(o.subMenu, titleFormatted)
        : [],
      route_: parent
        ? `${parent.toLowerCase()}-${titleFormattedToLowerCase}`
        : titleFormattedToLowerCase,
      moduleTitle_: `${o.title}`,
      isNodeExpanded_: o.autoExpandChildren
    };
  });
}

@Injectable()
export class SidebarService {
  private sidebarDataActiveItem_$: BehaviorSubject<SidebarMenuItemModel | null> =
    new BehaviorSubject<SidebarMenuItemModel | null>(null);

  constructor(private httpService: HttpService) {}

  get sidebarDataActiveItem$(): Observable<SidebarMenuItemModel | null> {
    return this.sidebarDataActiveItem_$.asObservable();
  }

  setSidebarDataActiveItem(sidebarDataItem: SidebarMenuItemModel): void {
    this.sidebarDataActiveItem_$.next(sidebarDataItem);
  }

  getSidebarMenu(): Observable<SidebarMenuItemModel[]> {
    return this.httpService
      .get<SidebarMenuItemModel[]>(
        'AppSubscription/AppUserProductSubMenu',
        true
      )
      .pipe(
        map((res) => res || []),
        map((res) => formatSideMenuData(res))
      );
  }
}
