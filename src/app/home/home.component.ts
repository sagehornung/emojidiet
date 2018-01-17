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
  selectedFreebie = '';
  selectedAnEmotion = false;
  selectedAPleasure = false;
  selectedAFreebie = false;
  saveEnabeled = false;
  dayScore: number;
  weekScore: number;
  lastWeekScore: number;
  constructor(public toastCtrl: ToastController, private quoteService: QuoteService,
              private mealService: MealService, private scoresService: ScoresService) {
  }

  ngOnInit() {
    this.saveEnabeled = (this.selectedAnEmotion && this.selectedAPleasure) || this.selectedAFreebie;
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
    this.selectedEmotion = entry;
    console.log('Selected Emotion = ', this.selectedEmotion);
    this.selectedAnEmotion = true;
  }

  onPleasureChange(entry: string) {
    this.selectedPleasure = entry;
    console.log('Selected Pleasure = ', this.selectedPleasure);
    this.selectedAPleasure = false;
  }

  onFreebieSelect(entry: string) {
    this.selectedFreebie = this.selectedFreebie === entry ? '' : entry;
    this.selectedAFreebie = this.selectedFreebie !== '';
  }

  onSubmit() {
    const emotion = this.selectedEmotion;
    const pleasure = this.selectedPleasure;
    const freebie = this.selectedFreebie !== '' ? this.selectedFreebie : '0';
    const meal = new Meal(emotion, pleasure, freebie);
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
      duration: 3000,
      position: 'top',
      cssClass: 'saved-meal-toast'
    });
    toast.present();
    this.selectedEmotion = '';
    this.selectedPleasure = '';
    this.selectedFreebie = '';
    this.selectedAnEmotion = false;
    this.selectedAPleasure = false;
    this.selectedAFreebie = false;
  }
  getScores() {
    this.scoresService.getScores()
      .subscribe(scores => {
        console.log('Yay I scored some scores', scores);
        this.dayScore = scores[0][0] ? Math.round(scores[0][0].day_score * 100) / 100 : 0;
        this.weekScore = scores[1][0] ? Math.round(scores[1][0].current_week_score  * 100) / 100 : 0;
        this.lastWeekScore = scores[2][0] ? Math.round(scores[2][0].last_week_score * 100) / 100 : 0;
        console.log(this.dayScore, this.weekScore, this.lastWeekScore);
      });
  }

}
