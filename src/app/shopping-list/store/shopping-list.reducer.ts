import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5, 'nos'),
    new Ingredient('Tomatoes', 10, 'nos')
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      const oldIngredients = [...state.ingredients];
      const index = oldIngredients.findIndex(ing => ing.name === action.payload.name);
      if (index === -1) {
        return { ...state, ingredients: [...state.ingredients, action.payload] };
      }
      const uIng = {
        ...oldIngredients[index],
        amount: oldIngredients[index].amount + action.payload.amount
      };
      oldIngredients[index] = uIng;
      return { ...state, ingredients: [...oldIngredients] };
    case ShoppingListActions.ADD_INGREDIENTS:
      const newIngredients = [...state.ingredients];
      action.payload.forEach((newIg: Ingredient) => {
        const index = newIngredients.findIndex(ing => newIg.name === ing.name);
        if (index === -1) {
          newIngredients.push(newIg);
        } else {
          const updatedIng = {
            ...newIngredients[index],
            amount: newIngredients[index].amount + newIg.amount
          };
          newIngredients[index] = updatedIng;
        }
      });
      return { ...state, ingredients: [...newIngredients] };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing, ingIndex) => ingIndex !== state.editedIngredientIndex),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    default:
      return state;
  }
}
