import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // this.userSub = this.authService.user.subscribe(
    //   user => {
    //     this.isAuthenticated = !!user;
    //   }
    // );
    this.userSub = this.store.select('auth').pipe(
      map(authState => {
        return authState.user;
      })).subscribe(
        user => {
          this.isAuthenticated = !!user;
        }
      );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  saveRecipes() {
    this.dataStorageService.saveRecipes();
  }

  fetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe(
      (response) => {},
      (err) => console.log(err)
    );
  }
}
