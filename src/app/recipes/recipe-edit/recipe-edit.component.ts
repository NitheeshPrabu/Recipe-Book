import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  get formIngredients() {
    return (this.recipeForm.get('ingredients') as FormArray);
  }

  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(
        map(recipeState => recipeState.recipes.find((recipe, index) => index === this.id))
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImgPath = recipe.imgPath;
        recipeDescription = recipe.description;
        if (recipe.ingredients) {
          for (const ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, Validators.pattern(/^[1-9]+[0-9]*$/)),
              'unit': new FormControl(ingredient.unit, Validators.required)
            }));
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imgPath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onAddIngredient() {
    const lastControlGroup = (this.formIngredients.at(this.formIngredients.length - 1) as FormGroup);
    let lastControl;
    console.log(lastControl);
    if (lastControlGroup !== undefined) {
      lastControl = lastControlGroup.controls;
    }
    if (lastControlGroup === undefined || (lastControl.name.value !== null || lastControl.amount.value !== null || lastControl.unit.value !== null)) {
      this.formIngredients.push(
        new FormGroup({
          'name': new FormControl(null, Validators.required),
          'amount': new FormControl(null, Validators.pattern(/^[1-9]+[0-9]*$/)),
          'unit': new FormControl(null, Validators.required)
        })
      );
    }
  }

  onDeleteIngredient(index: number) {
    this.formIngredients.removeAt(index);
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new RecipesActions.UpdateRecipe({
        index: this.id,
        newRecipe: this.recipeForm.value
      }));
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onPrevious();
  }

  onPrevious() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
