import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { Ingredient } from '../shared/ingredient.model';

// Same as adding to providers list inside AppModule
@Injectable({ providedIn: 'root' })
export class ShoppingListService {
	ingredientsChanged = new EventEmitter<Ingredient[]>();

	private ingredients: Ingredient[] = [
		new Ingredient('Apples', 5, 'nos'),
		new Ingredient('Tomatoes', 10, 'nos')
	];

	getIngredients() {
		return this.ingredients.slice();
	}

	addIngredient(ingredient: Ingredient) {
		this.ingredients.push(ingredient);
		this.__combineIngredients();
		this.ingredientsChanged.emit(this.ingredients.slice());
	}

	addIngredients(ingredients: Ingredient[]) {
		this.ingredients.push(...ingredients);
		this.__combineIngredients();
		this.ingredientsChanged.emit(this.ingredients.slice());
	}

	__combineIngredients() {
		this.ingredients = _.chain(this.ingredients).reduce((acc: Ingredient[], i: Ingredient) => {
			const index = _.findIndex(acc, {name: i.name});
			if (index === -1) {
				acc.push(new Ingredient(i.name, i.amount, i.unit));
			} else {
				acc[index].amount += i.amount;
			}
			return acc;
		}, []).value();
	}
}
