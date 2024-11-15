import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * triggers automatically
   */
  canActivate(): boolean {
    if (this.authenticationService.userToken) {
      return true;
    }

    this.authenticationService.logout();
    return false;
  }
}
