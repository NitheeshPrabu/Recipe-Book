import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Also gives subscribers immediate access to the previously emitted values
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyB8Hp1XK7UP1bv_pnumyPBtnZR_vLtic0I',
        { email, password, returnSecureToken: true }
      ).pipe(catchError(this.handleError), tap(response => {
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
      }));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyB8Hp1XK7UP1bv_pnumyPBtnZR_vLtic0I',
        { email, password, returnSecureToken: true }
      ).pipe(catchError(this.handleError), tap(response => {
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
      }));
  }

  handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
  }

  handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured.';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}
