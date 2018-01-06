import { Component, OnInit, Input } from '@angular/core';
import { Meal } from '../../home/meal.component';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  @Input() icon: number;
  @Input() message: string = null;
  @Input() meal: Meal;
  emotionIcon: string;
  pleasureIcon: string;
  freebieIcon: string;
  majorEmoji: string;
  majorPts: string;
  minorEmoji: string;
  minorPts: string;
  isFreebie: boolean;
  equalPoints: boolean;
  constructor() {
  }

  ngOnInit() {
    this.pleasureIcon = this.getPleasureIcon();
    this.emotionIcon = this.getEmotionIcon();
    this.freebieIcon = this.getFreebieIcon();
    this.setMajorAndMinor();
  }

  getEmotionIcon() {
    switch ( Number(this.meal.emotion)) {
      case 1: {
        return '😤';
      }
      case 2: {
        return '😎';
      }
      case 3: {
        return '😐';
      }
      case 4: {
        return '😂';
      }
      case 5: {
        return '🙈';
      }
      default: {
        return null;
      }
    }
  }
  getPleasureIcon() {
    switch ( Number(this.meal.pleasure)) {
      case 1: {
        return '😐';
      }
      case 2: {
        return '😏';
      }
      case 3: {
        return '😃';
      }
      case 4: {
        return '😛';
      }
      case 5: {
        return '😍';
      }
      default: {
        return null;
      }
    }
  }
  getFreebieIcon() {
    switch ( Number(this.meal.freebie)) {
      case 1: {
        return '🥗';
      }
      case 2: {
        return '🥤';
      }
      default: {
        return null;
      }
    }
  }
  setMajorAndMinor() {
    if ( this.meal.freebie != null  && Number(this.meal.freebie) > 0) {
      this.majorEmoji = this.freebieIcon;
      this.majorPts = '1';
      this.minorEmoji = '';
      this.minorPts = '';
      this.isFreebie = true;
      console.log('ME', this.majorEmoji);
    } else if ( this.meal.pleasure < this.meal.emotion) {
      this.majorEmoji = this.emotionIcon;
      this.majorPts = this.meal.emotion;
      this.minorEmoji = this.pleasureIcon;
      this.minorPts = this.meal.pleasure;
      this.isFreebie = false;
    } else if ( this.meal.pleasure > this.meal.emotion) {
      this.majorEmoji = this.pleasureIcon;
      this.majorPts = this.meal.pleasure;
      this.minorEmoji = this.emotionIcon;
      this.minorPts = this.meal.emotion;
      this.isFreebie = false;
    } else {
      this.equalPoints = true;
      this.majorEmoji = this.pleasureIcon;
      this.minorEmoji = this.emotionIcon;
      this.majorPts = this.meal.emotion;
      this.minorPts = this.meal.pleasure;
      this.isFreebie = false;
    }
  }
}
