import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { APPLICATION_SIDEBAR_ACTIVE_ITEM_INDEX } from '../../core/constants/app-constants';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';
import { LoginModel } from '../../core/models';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  public form: FormGroup = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  public readonly loginControl = this.form.controls['login'];
  public readonly passwordControl = this.form.controls['password'];

  private readonly destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sidebarService: SidebarService,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onFormSubmit(): void {
    this.authenticationService
      .authorize({
        userName: this.loginControl.value,
        user_Pwd: this.passwordControl.value
      })
      .pipe(
        takeUntil(this.destroyed$),
        filter((res: LoginModel) => !!res.appUser),
        switchMap(() => this.sidebarService.getSidebarMenu())
      )
      .subscribe((res) => {
        if (!res.length) {
          this.loadingOverlayService.setIsLoadingState(false);
        }
        this.router
          .navigate([
            res.length ? res[APPLICATION_SIDEBAR_ACTIVE_ITEM_INDEX].route_ : '/'
          ])
          .then();
      });
  }
}
