import 'rxjs/add/operator/finally';

import { Component, Input, OnInit } from '@angular/core';

import { QuoteService } from './quote.service';
import { MealService } from './meal.service';
import { Meal } from './meal.component';

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
  constructor(private quoteService: QuoteService, private mealService: MealService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quoteService.getRandomQuote({ category: 'explicit' })
      .finally(() => { this.isLoading = false; })
      .subscribe((quote: any) => {
        console.log('Q', quote);
        this.quote = quote.quoteText;
        this.quoteAuthor = quote.quoteAuthor;
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
    this.clickMessage = 'You are my hero! Emotion = ' + this.selectedEmotion + ' Pleasure = ' + this.selectedPleasure;
    const emotion = this.selectedEmotion;
    const pleasure = this.selectedPleasure;
    console.log('Test');
    console.log(this.meal);
    const meal = new Meal(emotion, pleasure);
    this.mealService.saveMeal(meal)
      .subscribe((res: any) => {
        console.log(res);
      });

  }
}
