import { Component, OnInit } from '@angular/core';
import { MealService } from '../home/meal.service';

import { environment } from '../../environments/environment';
import { ModalController } from 'ionic-angular';
import { NavController} from 'ionic-angular';
import { ModalPageComponent } from './edit-meal.modal';
import { Meal } from '../home/meal.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  meals: Array<any>;
  version: string = environment.version;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private mealService: MealService) { }

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

  public openModal(meal: Meal) {
    const modalPage = this.modalCtrl.create(ModalPageComponent, meal );
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed');
      this.getHistory();
    });
    modalPage.present();
  }

}
