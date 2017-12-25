import { Component, OnInit } from '@angular/core';
import { MealService } from '../home/meal.service';

import { environment } from '../../environments/environment';
import { ModalController } from 'ionic-angular';


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
      .subscribe( response  => {
        console.log('Q', response.data);
        this.meals = response.data;
      });
  }
}
