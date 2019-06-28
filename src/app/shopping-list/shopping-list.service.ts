import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { Ingredient } from '../shared/ingredient.model';

// Same as adding to providers list inside AppModule
@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5, 'nos'),
    new Ingredient('Tomatoes', 10, 'nos')
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient, singleUpdate: boolean) {
    const index = this.ingredients.findIndex(oldIng => oldIng.name === ingredient.name);
    if (index === -1) {
      this.ingredients.push(ingredient);
    } else {
      const ing = this.getIngredient(index);
      ing.amount += ingredient.amount;
      this.updateIngredient(index, ing);
    }
    // this.__combineIngredients();
    if (singleUpdate) {
      this.ingredientsChanged.next(this.ingredients.slice());
    }
  }

  addIngredients(ingredients: Ingredient[]) {
    ingredients.forEach(newIng => {
      this.addIngredient(newIng, false);
    });
    this.ingredientsChanged.next(this.ingredients.slice());

    // this.ingredients.push(...ingredients);
    // this.__combineIngredients();
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
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
