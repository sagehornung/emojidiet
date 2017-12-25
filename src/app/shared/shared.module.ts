import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { LoaderComponent } from './loader/loader.component';
import { MeComponent} from './me/me.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    LoaderComponent,
    MeComponent
  ],
  exports: [
    LoaderComponent,
    MeComponent
  ]
})
export class SharedModule { }
