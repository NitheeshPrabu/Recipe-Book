import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('form', {static: false}) shoplistForm: NgForm;

  constructor(private shoplistService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoplistService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoplistService.getIngredient(this.editedItemIndex);
        this.shoplistForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
          unit: this.editedItem.unit
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmitItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, +value.amount, value.unit);
    if (this.editMode) {
      this.shoplistService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoplistService.addIngredient(newIngredient, true);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoplistForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoplistService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
