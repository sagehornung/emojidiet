import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { MealService } from './meal.service';
import { EmojiSelectorComponent } from './emoji-selector.component';
import { AuthenticationService } from '../core/authentication/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    IonicModule,
    HomeRoutingModule,
  ],
  entryComponents: [
    HomeComponent,
    EmojiSelectorComponent
  ],
  declarations: [
    HomeComponent,
    EmojiSelectorComponent
  ],
  providers: [
    QuoteService,
    MealService,
    AuthenticationService

  ]
})
export class HomeModule { }
