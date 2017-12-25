import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';

import { MealService } from '../home/meal.service';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    CoreModule,
    SharedModule,
    HistoryRoutingModule
  ],
  entryComponents: [
    HistoryComponent
  ],
  declarations: [
    HistoryComponent
  ],
  providers: [
    MealService
  ]
})
export class HistoryModule { }
