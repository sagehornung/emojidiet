import 'rxjs/add/operator/finally';

import { Component, Input, OnInit } from '@angular/core';

import { QuoteService } from './quote.service';
import { MealService } from './meal.service';
import { Meal } from './meal.component';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  @Input() meal: Meal;
  clickMessage: string;
  quote: any;
  quoteAuthor: any;
  quoteText: string;
  isLoading: boolean;
  selectedEmotion: string;
  selectedPleasure: string;
  constructor(public toastCtrl: ToastController, private quoteService: QuoteService,
              private mealService: MealService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quoteService.getRandomQuote({ category: 'explicit' })
      .finally(() => { this.isLoading = false; })
      .subscribe((quote: any) => {
        console.log('Q', quote);
        if(quote) {
          quote = JSON.parse(quote);
          this.quote = quote.quoteText;
          this.quoteAuthor = quote.quoteAuthor;
        } else {
          this.quote = 'Perspective: Nothing is impossible.  You made it here in the universe against infinitesimal ' +
            'odds. You can accomplish, against all odds, what seems to be impossible when you believe in yourself.';
          this.quoteAuthor = 'David C. Medway';
        }
      });
  }
  onEmotionChange(entry: string) {
    // this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
    this.selectedEmotion = entry;
    console.log('Selected Emotion = ', this.selectedEmotion);
  }

  onPleasureChange(entry: string) {
    // this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
    this.selectedPleasure = entry;
    console.log('Selected Pleasure = ', this.selectedPleasure);
  }

  onSubmit() {
    //this.clickMessage = 'You are my hero! Emotion = ' + this.selectedEmotion + ' Pleasure = ' + this.selectedPleasure;
    const emotion = this.selectedEmotion;
    const pleasure = this.selectedPleasure;
    console.log('Test');
    console.log(this.meal);
    const meal = new Meal(emotion, pleasure);
    this.mealService.saveMeal(meal)
      .subscribe((res: any) => {
        console.log(res);
        this.mealSavedToast(emotion, pleasure);
      });
  }
  mealSavedToast(emotion: string, pleasure: string) {
    const toast = this.toastCtrl.create({
      message: `Meal Saved -- Emotion: ${emotion}, Pleasure: ${pleasure}` ,
      duration: 4000,
      position: 'top',
      cssClass: 'saved-meal-toast'
    });
    toast.present();
    this.selectedEmotion = '';
    this.selectedPleasure = '';
  }
}
