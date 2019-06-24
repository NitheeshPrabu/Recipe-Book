import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is simply a test', 
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/190501-maple-bacon-slamon-067-1561134593.jpg?crop=1xw:0.749802683504341xh;center,top&resize=480:*'),
    new Recipe('A Test Recipe', 'This is simply a test', 
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/190501-maple-bacon-slamon-067-1561134593.jpg?crop=1xw:0.749802683504341xh;center,top&resize=480:*'),
    new Recipe('A Test Recipe', 'This is simply a test', 
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/190501-maple-bacon-slamon-067-1561134593.jpg?crop=1xw:0.749802683504341xh;center,top&resize=480:*')
  ];

  constructor() { }

  ngOnInit() { }

}
