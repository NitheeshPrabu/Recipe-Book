import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  //   new Recipe('Classic Lasagna', 'Authentic lasagna using homemade meat sauce.', 'https://images.food52.com/0GNWIgzGAOFRpotqkVzmvItEGFc=/620x413/filters:format(webp)/b925f0e6-ef24-467f-b153-f07b60d38d50--lasagna_2.jpg',
  //     [
  //       new Ingredient('Ground Chicken', 1, 'pound'),
  //       new Ingredient('Mozzarella Cheese', 12, 'ounces'),
  //       new Ingredient('Lasagna Noodles', 1, 'pack'),
  //       new Ingredient('Olive Oil', 1, 'tbs'),
  //       new Ingredient('Tomato Sauce', 15, 'ounces'),
  //       new Ingredient('Garlic', 2, 'cloves')
  //     ]),
  //   new Recipe('Creamy Chicken Piccata Pasta', 'A tasty chicken pasta!', 'https://images.food52.com/jc-maPCaLSK7zhZFh7sf1Qeo0ck=/620x413/filters:format(webp)/96461fc9-1ef0-493c-b1ce-60f709558f85--w4mMdv7BRPCeT4fGO5sJLg.jpg',
  //     [
  //       new Ingredient('Boneless Chicken Breasts', 6, 'nos'),
  //       new Ingredient('Lemons', 2, 'nos'),
  //       new Ingredient('Olive Oil', 4, 'tbs'),
  //       new Ingredient('Unsalted Butter', 3, 'tbs'),
  //       new Ingredient('Parsley', 2, 'tbs')
  //     ]),
  //   new Recipe('Skillet Chicken Thighs', 'With Spring vegetables and Shallot Vinaigrette.', 'https://images.food52.com/V38qFwYKa_yQEiZrsywQyBSyf2o=/fit-in/1200x1200/6d47223e-8f70-42d6-91d2-98ba1cb12a15--2018-0530_crispy-chicken-thighs-with-kale-and-croutons_3x2_rocky-luten_032.jpg',
  //     [
  //       new Ingredient('Chicken Thighs', 4, 'nos'),
  //       new Ingredient('Garlic', 2, 'cloves'),
  //       new Ingredient('Shallots', 4, 'nos'),
  //       new Ingredient('Extra Virgin Olive Oil', 1, 'tbs'),
  //       new Ingredient('Asparagas', 1, 'nos')
  //     ]),
  //   new Recipe('Spongy Japanese Cheesecake', 'It\'s a cheesecake that\'s actually a cake!', 'https://images.food52.com/Yb12_gTxwf3IRMkGobixZhVQTVc=/778x518/85d8361a-61cd-4c01-bd58-745ca7639abb--2018-0108_japanese-cheesecake_3x2_bobbi-lin_6623.jpg',
  //     [
  //       new Ingredient('Cream Cheese', 8, 'ounces'),
  //       new Ingredient('Unsalted Butter', 4, 'tbs'),
  //       new Ingredient('Whole Milk', 76, 'g'),
  //       new Ingredient('Eggs', 4, 'nos'),
  //       new Ingredient('Cake Flour', 60, 'g'),
  //       new Ingredient('Sugar', 198, 'g'),
  //       new Ingredient('Whipped Cream', null, 'for finishing')
  //     ]),
  //   new Recipe('Ratatouille', 'Straight from Remy\'s kitchen', 'http://i.imgur.com/aB0jfnW.jpg',
  //     [
  //       new Ingredient('Olive Oil', 2, 'tbs'),
  //       new Ingredient('Onion', 1, 'nos'),
  //       new Ingredient('Chopped Basil', 2, 'tbs'),
  //       new Ingredient('Tomatoes', 6, 'nos'),
  //       new Ingredient('Eggplant', 2, 'nos'),
  //       new Ingredient('Zucchinis', 2, 'nos'),
  //       new Ingredient('Yellow Squash', 2, 'nos'),
  //       new Ingredient('Chopped Parsley', 2, 'tbs'),
  //       new Ingredient('Chopped Thyme', 2, 'tbs')
  //     ])
  // ];

  constructor(private store: Store<fromApp.AppState>) { }

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
