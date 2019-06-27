export class Ingredient {
  // public name: string;
  // public amount: number;

  // constructor(name: string, amount: number) {
  // 	this.name = name;
  // 	this.amount = amount;
  // }

  // can instead do it like this
  constructor(public name: string, public amount: number, public unit: string) { }
}
