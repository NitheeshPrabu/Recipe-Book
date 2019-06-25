import {EventEmitter} from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {
	recipeSelected = new EventEmitter<Recipe>();
	private recipes: Recipe[] = [
		new Recipe('Classic Lasagna', 'Authentic lasagna using homemade meat sauce.',
			'https://images.food52.com/0GNWIgzGAOFRpotqkVzmvItEGFc=/620x413/filters:format(webp)/b925f0e6-ef24-467f-b153-f07b60d38d50--lasagna_2.jpg'),
		new Recipe('Creamy Chicken Piccata Pasta', 'A tasty chicken pasta!',
			'https://images.food52.com/jc-maPCaLSK7zhZFh7sf1Qeo0ck=/620x413/filters:format(webp)/96461fc9-1ef0-493c-b1ce-60f709558f85--w4mMdv7BRPCeT4fGO5sJLg.jpg'),
		new Recipe('Skillet Chicken Thighs', 'With Spring vegetables and Shallot Vinaigrette.',
			'https://images.food52.com/V38qFwYKa_yQEiZrsywQyBSyf2o=/fit-in/1200x1200/6d47223e-8f70-42d6-91d2-98ba1cb12a15--2018-0530_crispy-chicken-thighs-with-kale-and-croutons_3x2_rocky-luten_032.jpg'),
		new Recipe('Spongy Japanese Cheesecake', 'It\'s a cheesecake that\'s actually a cake!',
		'https://images.food52.com/Yb12_gTxwf3IRMkGobixZhVQTVc=/778x518/85d8361a-61cd-4c01-bd58-745ca7639abb--2018-0108_japanese-cheesecake_3x2_bobbi-lin_6623.jpg'),
		new Recipe('Ratatouille', 'Straight from Remy\'s kitchen', 'http://i.imgur.com/aB0jfnW.jpg')
	];

	getRecipes() {
		return this.recipes.slice();
	}
}
