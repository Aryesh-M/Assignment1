import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

interface noOfPizza {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.css']
})



export class SimpleTableComponent {
  pizzaValue: any = [1, 1, 1, 1];
  pizzaSizes: any[] = [
    { size: 'Small', pizzaPrice: 5.0, selected: false, noOfPizza: 1 },
    { size: 'Medium', pizzaPrice: 7.0, selected: false, noOfPizza: 1 },
    { size: 'Large', pizzaPrice: 8.0, selected: false, noOfPizza: 1 },
    { size: 'Extra Large', pizzaPrice: 9.0, selected: false, noOfPizza: 1 }
  ];
  totalToppings: any[] = [
    { type: 'veg', name: 'Tomatoes', toppingPrice: 1.0, pizzaSizes: this.pizzaSizes },
    { type: 'veg', name: 'Onions', toppingPrice: 0.5, pizzaSizes: this.pizzaSizes },
    { type: 'veg', name: 'BellPepper', toppingPrice: 1.0, pizzaSizes: this.pizzaSizes },
    { type: 'veg', name: 'Mushrooms', toppingPrice: 1.2, pizzaSizes: this.pizzaSizes },
    { type: 'veg', name: 'Pineapple', toppingPrice: 0.75, pizzaSizes: this.pizzaSizes },
    { type: 'nonveg', name: 'Sausage', toppingPrice: 1.0, pizzaSizes: this.pizzaSizes },
    { type: 'nonveg', name: 'Pepperoni', toppingPrice: 2.0, pizzaSizes: this.pizzaSizes },
    { type: 'nonveg', name: 'BarbecueChicken', toppingPrice: 3.0, pizzaSizes: this.pizzaSizes }
  ];

  offers: any = {
    offer1: { code: 'offer1', description: 'Offer1 - 1 Medium Pizza with 2 toppings', price: 5.0, isApplied: false },
    offer2: { code: 'offer2', description: 'Offer2 - 2 Medium Pizza with 4 toppings each', price: 9.0, isApplied: false },
    offer3: { code: 'offer3', description: 'Offer3 - 1 Large Pizza with 4 toppings (Pepperoni and Barbecue chicken are counted as 2 toppings) - 50% discount', price: 6.5, isApplied: false }
  };

  appliedOffers: any = [];

  orderData: any = [];

  selectedOffer: any;

  pricesSizeWise: any = [];

  oneEqualsTwoToppings: any = ["BarbecueChicken", "Pepperoni"]

  noOfPizzaSelected: any = 1;

  toppings = this._formBuilder.group({
    Tomatoes: false,
    Onions: false,
    BellPepper: false,
    Mushrooms: false,
    Pineapple: false,
    Sausage: false,
    Pepperoni: false,
    BarbecueChicken: false,
  });
  constructor(private _formBuilder: FormBuilder) {

  }

  // "number of pizza" selection change
  onNumberChange(event: any) {
    this.noOfPizzaSelected = +event.target.value;

    this.itemSelected(event, 1, 1, true);
  }

  //  when topping selection changes
  itemSelected(event: any, itemIndex: number, sizeIndex: number, isDropdownChanged: boolean) {
    this.appliedOffers = [];

    if (!isDropdownChanged) {// if dropdown is changed but items are as it is
      let topping = this.totalToppings[itemIndex];
      let size = this.totalToppings[itemIndex].pizzaSizes[sizeIndex];
      size.selected = event.checked;
      let combined = {
        ...topping,
        ...size,
        pizzaSizes: []
      }
      if (event.checked) {
        this.orderData.push(combined);
      } else {
        this.orderData = this.orderData.filter((object: { name: any; type: any; toppingPrice: any; size: any }) => {
          return !(object.name == combined.name && object.type == combined.type && object.toppingPrice == combined.toppingPrice && object.size == combined.size)
        });
      }
    }
    let selectedPizzas: any = {
      "Small": { toppingPrice: 0.0, price: 5.0, totalToppingPrice: 0.0, numberOfToppings: 0, finalPrice: 0.0, discountedPrice: 0.0, size: "Small", noOfPizza: 1 },
      "Medium": { toppingPrice: 0.0, price: 7.0, totalToppingPrice: 0.0, numberOfToppings: 0, finalPrice: 0.0, discountedPrice: 0.0, size: "Medium", noOfPizza: 1 },
      "Large": { toppingPrice: 0.0, price: 8.0, totalToppingPrice: 0.0, numberOfToppings: 0, finalPrice: 0.0, discountedPrice: 0.0, size: "Large", noOfPizza: 1 },
      "Extra Large": { toppingPrice: 0.0, price: 9.0, totalToppingPrice: 0.0, numberOfToppings: 0, finalPrice: 0.0, discountedPrice: 0.0, size: "Extra Large", noOfPizza: 1 }
    };
    this.orderData.forEach((element: {
      toppingPrice: any;
      size: string | number;
      numberOfToppings: number;
      name: string;
    }) => {
      selectedPizzas[element.size].totalToppingPrice += element.toppingPrice;
      if (this.oneEqualsTwoToppings.includes(element.name) && selectedPizzas[element.size].size == "Large") {
        selectedPizzas[element.size].numberOfToppings += 2;
      } else {
        selectedPizzas[element.size].numberOfToppings += 1;
      }
    });
    let pricesSizeWise = Object.values(selectedPizzas).map((c: any) => {
      if (c.totalToppingPrice > 0) {
        let currentElement = selectedPizzas[c.size];

        currentElement.finalPrice += currentElement.price + currentElement.totalToppingPrice;
        if (currentElement.size == "Medium") {
          currentElement.finalPrice = currentElement.finalPrice * this.noOfPizzaSelected;
        }
        // offer1 includes 1 medium pizza with 2 toppings
        if (currentElement.size == "Medium") {
          if (currentElement.numberOfToppings == 2 && this.noOfPizzaSelected == 1) {
            this.appliedOffers.push(this.offers.offer1);
            selectedPizzas[c.size].discountedPrice = 5.0;
            this.offers.offer1.isApplied = true;
          } else {
            this.offers.offer1.isApplied = false;
          }
          // offer2 includes 2 medium pizzas with 4 toppings each
          if (currentElement.numberOfToppings == 4 && this.noOfPizzaSelected == 2) {
            this.appliedOffers.push(this.offers.offer1);
            selectedPizzas[c.size].discountedPrice = 9.0;
            this.offers.offer2.isApplied = true;
          } else {
            this.offers.offer2.isApplied = false;
          }
        }

        // offer3 includes 1 large pizza with 4 toppings
        if (currentElement.size == "Large") {
          if (currentElement.numberOfToppings == 4) {
            this.offers.offer3.isApplied = true;
            selectedPizzas[c.size].discountedPrice = selectedPizzas[c.size].finalPrice * 0.50;
          } else {
            this.offers.offer3.isApplied = false;
          }
        }
      }
      return selectedPizzas;
    });

    this.pricesSizeWise = Object.values(pricesSizeWise[0]);
    this.appliedOffers = Object.values(this.offers)
  }
}