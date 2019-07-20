import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occured.';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already has an account.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not have an account.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Wrong password.';
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupData: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.FIREBASE_API_KEY,
          {
            email: signupData.payload.email,
            password: signupData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(response => {
            this.authService.setLogoutTimer(+response.expiresIn * 1000);
          }),
          map(response => {
            return handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
          }),
          catchError((errorResponse) => {
            // must return a non-error observable
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    // should not be closed - this is a continuously running observable
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.FIREBASE_API_KEY,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(response => {
            this.authService.setLogoutTimer(+response.expiresIn * 1000);
          }),
          map(response => {
            return handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
          }),
          catchError((errorResponse) => {
            // must return a non-error observable
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/recipes']);
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData');
      this.authService.clearLogoutTimer();
      this.router.navigate(['/login']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string;
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
      }
      const loadedUser = new User(userData.email, userData.id, userData._token,
        new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        // this.user.next(loadedUser);
        const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expiresIn);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        });
        // const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        // this.autoLogout(expiresIn);
      }
      return { type: 'DUMMY' };
    })
  );

  constructor(private actions$: Actions, private http: HttpClient,
              private authService: AuthService, private router: Router) { }
}
