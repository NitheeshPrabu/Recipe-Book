import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://angular8-recipe-book.firebaseio.com/recipes.json', recipes)
      .subscribe(
        (response) => console.log(response),
        (err) => console.log(err)
      );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://angular8-recipe-book.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          });
        }), tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }
}