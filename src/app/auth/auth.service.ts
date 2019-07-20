import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Also gives subscribers immediate access to the previously emitted values
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) { }

  setLogoutTimer(expiresIn: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expiresIn);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
