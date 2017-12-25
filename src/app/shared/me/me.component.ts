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
  constructor() {
  }

  ngOnInit() {
    this.pleasureIcon = this.getPleasureIcon();
    this.emotionIcon = this.getEmotionIcon();
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
}
