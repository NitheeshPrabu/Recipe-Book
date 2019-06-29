import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  collapsed = true;

  constructor(private dataStorageService: DataStorageService, private loader: NgxUiLoaderService) {}

  saveRecipes() {
    this.dataStorageService.saveRecipes();
  }

  fetchRecipes() {
    this.loader.startBackground();
    this.dataStorageService.fetchRecipes().subscribe(
      (response) => {
        this.loader.stopBackground();
      }
    );
  }
}
