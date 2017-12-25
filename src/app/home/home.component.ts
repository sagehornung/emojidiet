import 'rxjs/add/operator/finally';

import { Component, Input, OnInit } from '@angular/core';

import { QuoteService } from './quote.service';
import { MealService } from './meal.service';
import { ScoresService } from './score.service';
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
  scores: Array<any>;
  quoteAuthor: any;
  quoteText: string;
  isLoading: boolean;
  selectedEmotion = '';
  selectedPleasure = '';
  selectedAnEmotion = false;
  selectedAPleasure = false;
  dayScore: number;
  weekScore: number;
  lastWeekScore: number;
  constructor(public toastCtrl: ToastController, private quoteService: QuoteService,
              private mealService: MealService, private scoresService: ScoresService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quote = 'Perspective: Nothing is impossible.  You made it here in the universe against infinitesimal ' +
      'odds. You can accomplish, against all odds, what seems to be impossible when you believe in yourself.';
    this.quoteAuthor = 'David C. Medway';
    this.quoteService.getRandomQuote({ category: 'explicit' })
      .finally(() => { this.isLoading = false; })
      .subscribe((quote: any) => {
        console.log('Q', quote);
        if (quote) {
          this.quote = quote.quoteText;
          this.quoteAuthor = quote.quoteAuthor;
        }
      });
    this.getScores();
  }
  onEmotionChange(entry: string) {
    // this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
    this.selectedEmotion = entry;
    console.log('Selected Emotion = ', this.selectedEmotion);
    this.selectedAnEmotion = true;
  }

  onPleasureChange(entry: string) {
    // this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
    this.selectedPleasure = entry;
    console.log('Selected Pleasure = ', this.selectedPleasure);
    this.selectedAPleasure = false;
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
        this.getScores();
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
    this.selectedAnEmotion = false;
    this.selectedAPleasure = false;
  }
  getScores() {
    this.scoresService.getScores()
      .subscribe(scores => {
        console.log('Yay I scored some scores', scores);
        this.dayScore = Math.round(scores[0][0].day_score * 100) / 100;
        this.weekScore = scores[1][0].current_week_score;
        this.lastWeekScore = scores[2][0] ? scores[2][0].last_week_score : 0;
        console.log(this.dayScore, this.weekScore, this.lastWeekScore);
      });
  }

}
