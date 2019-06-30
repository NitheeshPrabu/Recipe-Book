import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
  declarations: [
    AlertComponent,
    DropdownDirective,
    PlaceholderDirective
  ],
  imports: [
    CommonModule  // add BrowserModule only once in root, all other places add CommonModule
  ],
  exports: [
    AlertComponent,
    DropdownDirective,
    PlaceholderDirective,
    CommonModule
  ],
  entryComponents: [AlertComponent]
})
export class SharedModule { }
