import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, Observable, Subject, combineLatest } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EnterpriseLocationService } from '../../core/services/enterprise-location.service';
import { EnterpriseService } from '../../core/services/enterprise.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  templateUrl: './dynamic-module-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicModuleWrapperComponent implements OnDestroy {
  private readonly destroyed$: Subject<void> = new Subject<void>();

  public activeURL$: Observable<SafeResourceUrl> = combineLatest([
    this.sidebarService.sidebarDataActiveItem$,
    this.enterpriseService.currentEnterpriseActiveItem$,
    this.enterpriseLocationService.currentEnterpriseLocationActiveItem$
  ]).pipe(
    map(
      ([
        sidebarActiveItem,
        currentEnterpriseActiveItem,
        currentEnterpriseLocationActiveItem
      ]) => ({
        sidebarActiveItem,
        currentEnterpriseActiveItem,
        currentEnterpriseLocationActiveItem
      })
    ),
    map((res) => {
      const userApiKey = this.authenticationService.getAppBasedUserToken(
        res.sidebarActiveItem?.app_Uuid_Target
      );
      if (
        res.sidebarActiveItem &&
        res.currentEnterpriseActiveItem &&
        res.currentEnterpriseLocationActiveItem &&
        userApiKey
      ) {
        return this.generateIframeUrl(
          userApiKey,
          res.currentEnterpriseActiveItem.id!,
          res.currentEnterpriseLocationActiveItem.id!,
          res.sidebarActiveItem.urlTarget
        );
      }
      return '';
    })
  );

  constructor(
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private sidebarService: SidebarService,
    private enterpriseService: EnterpriseService,
    private enterpriseLocationService: EnterpriseLocationService
  ) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private generateIframeUrl(
    apiToken: string,
    enterpriseId: number,
    locationId: number,
    url: string
  ): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `${url}?enterprise_id=${enterpriseId}&location_id=${locationId}&session_token=${apiToken}`
    );
  }
}
