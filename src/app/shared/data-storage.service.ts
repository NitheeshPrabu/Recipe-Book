import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private loader: NgxUiLoaderService) { }

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.loader.startBackground();
    this.http
      .put('https://angular8-recipe-book.firebaseio.com/recipes.json', recipes)
      .subscribe(
        (response) => {
          console.log(response);
          this.loader.stopBackground();
        }, (err) => {
          console.log(err);
          this.loader.stopBackground();
        }
      );
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://angular8-recipe-book.firebaseio.com/recipes.json')
      .pipe(map((recipes) => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
         });
      }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
