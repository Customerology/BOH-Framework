import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output
} from '@angular/core';
import {
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import { SidebarService } from '../../core/services/sidebar.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EnterpriseModel } from 'src/app/core/models';
import { EnterpriseLocationModel } from 'src/app/core/models/enterprise-location.model';
import { EnterpriseLocationService } from 'src/app/core/services/enterprise-location.service';
import { EnterpriseService } from 'src/app/core/services/enterprise.service';

@Component({
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnDestroy {
  show = true;
  hide = false;
  hidelocation = true;
  @Output() sidenavToggled = new EventEmitter<boolean>();
  menuStatus = true;
  SideNavToggle() {
    this.menuStatus = !this.menuStatus;
    this.sidenavToggled.emit(this.menuStatus);
  }
  private enterprisesOriginal$: Observable<EnterpriseModel[]> =
    this.enterpriseService.getAllEnterprises(true).pipe(
      shareReplay(1),
      tap((res) => {
        this.form.controls['enterprise'].patchValue(
          this.enterpriseService.currentEnterpriseItemLS ?? res[0],
          {
            emitEvent: false
          }
        );
      })
    );

  private enterpriseLocationOriginal$: Observable<EnterpriseLocationModel[]> =
    this.enterpriseService.currentEnterpriseActiveItem$.pipe(
      shareReplay(1),
      filter((res) => !!res?.id),
      switchMap((res, n) =>
        this.enterpriseLocationService.getLocationByEnterpriseId(
          Number(res?.id),
          n === 0
        )
      ),
      tap((res) => {
        const nullItem: any = null;
        const noLocation: EnterpriseLocationModel = {
          assignedPhoneNumber: '',
          businessFaxNumber: '',
          businessPhoneNumber: '',
          category_Ids: [],
          enabled: nullItem,
          enterprise_Id: nullItem,
          guid: '',
          hours: '',
          id: nullItem,
          imageUrl: '',
          jsonStoreHours: '',
          latitude: nullItem,
          longitude: nullItem,
          name: 'No Location Selected',
          overall_Rating: nullItem,
          place_Id: '',
          timezone: '',
          website: '',
          jsonStreetAddress: []
        };
        res.splice(0, 0, noLocation);
        this.form.controls['location'].patchValue(res[0], {
          emitEvent: false
        });
        this.enterpriseLocationService.setCurrentEnterpriseLocationActiveItem(
          res[0]
        );
      })
    );

  public enterpriseItemName$ =
    this.enterpriseService.currentEnterpriseActiveItem$.pipe(
      map((data) => data?.name)
    );

  public enterpriseLocationItemName$ =
    this.enterpriseLocationService.currentEnterpriseLocationActiveItem$.pipe(
      map((data) => data?.name || '--.--')
    );

  public form: FormGroup = this.fb.group({
    enterprise: [''],
    location: ['']
  });

  public enterprises$: Observable<EnterpriseModel[]> =
    this.enterprisesOriginal$.pipe(
      switchMap((res) =>
        this.autoCompleteControlOptionsValue('enterprise', res)
      )
    );

  public enterpriseLocation$: Observable<EnterpriseLocationModel[]> =
    this.enterpriseLocationOriginal$.pipe(
      switchMap((res) => this.autoCompleteControlOptionsValue('location', res))
    );

  public currentModuleName$: Observable<string | undefined> =
    this.sidebarService.sidebarDataActiveItem$.pipe(
      map((res) => res?.moduleTitle_)
    );

  constructor(
    private sidebarService: SidebarService,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseService,
    private enterpriseLocationService: EnterpriseLocationService
  ) {}

  ngOnDestroy() {
    this.enterpriseService.setCurrentEnterpriseActiveItem(null);
    this.enterpriseLocationService.setCurrentEnterpriseLocationActiveItem(null);
  }

  private autoCompleteControlOptionsValue<T>(
    formControlName: string,
    optionsList: Array<T & { name: string }>
  ): Observable<T[]> {
    return this.form.controls[formControlName].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filterValue: string =
          typeof value === 'string' ? value : value?.name;

        return optionsList.filter(
          (option) =>
            option.name?.toLowerCase().indexOf(filterValue.toLowerCase()) === 0
        );
      })
    );
  }

  public displayFn(item: EnterpriseModel | EnterpriseLocationModel): string {
    return item?.name || '';
  }

  public onEnterpriseSelectionChange(enterprise: EnterpriseModel): void {
    this.enterpriseService.setCurrentEnterpriseActiveItem(enterprise);
  }

  public onLocationSelectionChange(location: EnterpriseLocationModel): void {
    this.enterpriseLocationService.setCurrentEnterpriseLocationActiveItem(
      location
    );
    this.show = false;
    this.hide = true;
  }
}
