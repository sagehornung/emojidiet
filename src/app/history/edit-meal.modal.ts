import { Component, OnInit } from '@angular/core';
import {ToastController, ViewController} from 'ionic-angular';
import { NavController} from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { IonicPage} from 'ionic-angular';
import { Meal } from '../home/meal.component';
import { MealService } from '../home/meal.service';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'edit-meal.modal.html',
  styleUrls: ['edit-meal.modal.scss']
})
export class ModalPageComponent implements OnInit {
  selectedPleasure: string = this.navParams.get('pleasure');
  selectedFreebie: string = this.navParams.get('freebie');
  selectedEmotion: string = this.navParams.get('emotion');
  created: Date = this.navParams.get('created') ? this.navParams.get('created') : '';
  mealId: string = this.navParams.get('_id');
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public viewCtrl: ViewController,
              public navParams: NavParams, private mealService: MealService) {
  }
  ngOnInit() {

  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  onEmotionChange(entry: string) {
    this.selectedEmotion = entry;
    console.log('Selected Emotion = ', this.selectedEmotion);
  }

  onPleasureChange(entry: string) {
    this.selectedPleasure = entry;
    console.log('Selected Pleasure = ', this.selectedPleasure);
  }

  onFreebieSelect(entry: string) {
    this.selectedFreebie = this.selectedFreebie === entry ? '' : entry;
  }
  mealSavedToast(emotion: string, pleasure: string) {
    const toast = this.toastCtrl.create({
      message: `Meal Updated -- Emotion: ${emotion}, Pleasure: ${pleasure}` ,
      duration: 3000,
      position: 'top',
      cssClass: 'saved-meal-toast'
    });
    toast.present();
  }
  mealDeletedToast() {
    const toast = this.toastCtrl.create({
      message: `Meal Deleted`,
      duration: 3000,
      position: 'top',
      cssClass: 'saved-meal-toast'
    });
    toast.present();
  }
  onUpdate() {
    const emotion = this.selectedEmotion;
    const pleasure = this.selectedPleasure;
    const freebie = this.selectedFreebie !== '' ? this.selectedFreebie : '0';
    const meal = new Meal(emotion, pleasure, freebie, this.mealId);
    this.mealService.updateMeal(meal)
      .subscribe((res: any) => {
        console.log(res);
        this.mealSavedToast(emotion, pleasure);
        this.closeModal();
      });
  }
  onDelete() {
    this.mealService.deleteMeal(this.mealId)
      .subscribe( (res: any) => {
        console.log(res);
        this.mealDeletedToast();
        this.closeModal();
    });
  }
}
