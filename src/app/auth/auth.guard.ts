import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):
    boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    // return this.authService.user.pipe(take(1), map(user => {
    //   const isAuth = !!user;
    //   if (isAuth) {
    //     return true;
    //   }
    //   return this.router.createUrlTree(['/login']);
    // }));
    return this.store.select('auth').pipe(take(1),
      map(authState => {
        return authState.user;
      }),
      map(user => {
        const isAuth = !!(user);
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      }));
  }
}
