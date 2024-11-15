import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, switchMap } from 'rxjs';
import { SidebarMenuItemModel } from '../../models';
import { AuthenticationService } from '../../services/authentication.service';
import { SidebarService } from '../../services/sidebar.service';

function findActiveRouteAndMutateOriginalData(
  array: SidebarMenuItemModel[],
  currentRoute: string
): SidebarMenuItemModel | null {
  for (const node of array) {
    if (node.route_ === currentRoute) {
      return node;
    }

    if (node.subMenu) {
      const child = findActiveRouteAndMutateOriginalData(
        node.subMenu,
        currentRoute
      );
      if (child) {
        node.autoExpandChildren = true;
        node.isNodeExpanded_ = true;
        return child;
      }
    }
  }
  return null;
}

const EASE_ANIMATION_DURATION = 150;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition(
        'false => true',
        animate(EASE_ANIMATION_DURATION + 'ms ease-in')
      ),
      transition(
        'true => false',
        animate(EASE_ANIMATION_DURATION + 'ms ease-out')
      )
    ])
  ]
})
export class SidebarComponent {
  @Input() sideNavStatus = false;

  public activeItem$: Observable<SidebarMenuItemModel | null> =
    this.sidebarService.sidebarDataActiveItem$;

  public sidebarDataFinal$: Observable<SidebarMenuItemModel[]> =
    this.sidebarService.getSidebarMenu().pipe(
      map((res) => {
        this.setSidebarDataActiveItem(res);
        return res;
      })
    );

  constructor(
    private authenticationService: AuthenticationService,
    private sidebarService: SidebarService,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(
          (route) =>
            route instanceof NavigationEnd && this.router.url !== '/login'
        ),
        switchMap(() => this.sidebarService.getSidebarMenu()),
        map((res) => {
          this.setSidebarDataActiveItem(res);
          return res;
        })
      )
      .subscribe();
  }

  onLogOutClick(): void {
    this.authenticationService.logout();
  }

  trackByFn(index: number): number {
    return index;
  }

  onNodeItemClick(node: SidebarMenuItemModel): void {
    if (node.subMenu) {
      node.isNodeExpanded_ = !node.isNodeExpanded_;
    }
  }

  private setSidebarDataActiveItem(res: SidebarMenuItemModel[]): void {
    const currentRoute = this.router.url.replace('/', '');
    const currentMenuItem = findActiveRouteAndMutateOriginalData(
      res,
      currentRoute
    );
    if (currentMenuItem) {
      this.sidebarService.setSidebarDataActiveItem(currentMenuItem);
    }
  }
}
