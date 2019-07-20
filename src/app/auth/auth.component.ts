import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertElement: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    // let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    } else {
      // authObs = this.authService.signup(email, password);
      this.store.dispatch(new AuthActions.SignupStart({email, password}));
    }

    // authObs.subscribe(
    //   (response) => {
    //     this.router.navigate(['/recipes']);
    //   }, (errorMessage) => {
    //     this.error = errorMessage;  // dont need anymore
    //     this.showErrorAlert(errorMessage);
    //   }
    // );
    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const elementViewContainerRef = this.alertElement.viewContainerRef;

    elementViewContainerRef.clear();
    const alertCompRef = elementViewContainerRef.createComponent(alertCompFactory);
    alertCompRef.instance.message = message;
    this.closeSub = alertCompRef.instance.closeEvent.subscribe(
      () => {
        this.closeSub.unsubscribe();
        elementViewContainerRef.clear();
      }
    );   // okay to manually subscribe
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
