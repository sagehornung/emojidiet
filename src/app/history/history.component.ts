import { Component, OnInit } from '@angular/core';
import { MealService } from '../home/meal.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  meals: Array<any>;
  version: string = environment.version;

  constructor(private mealService: MealService) { }

  ngOnInit() {
    this.getHistory();
  }

  getHistory() {
    this.mealService.getMeals()
      .subscribe( data  => {
        console.log('Q', data.data);
        this.meals = data.data;
      });
  }
}
