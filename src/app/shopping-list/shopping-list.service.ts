import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { Ingredient } from '../shared/ingredient.model';

// Same as adding to providers list inside AppModule
@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.__combineIngredients();
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.__combineIngredients();
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  __combineIngredients() {
    this.ingredients = _.chain(this.ingredients).reduce((acc: Ingredient[], i: Ingredient) => {
      const index = _.findIndex(acc, { name: i.name });
      if (index === -1) {
        acc.push(new Ingredient(i.name, i.amount, i.unit));
      } else {
        acc[index].amount += i.amount;
      }
      return acc;
    }, []).value();
  }
}
