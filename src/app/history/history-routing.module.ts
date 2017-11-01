import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route } from '../core/route.service';
import { extract } from '../core/i18n.service';
import { HistoryComponent } from './history.component';

const routes: Routes = Route.withShell([
  { path: 'history', component: HistoryComponent, data: { title: extract('History') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HistoryRoutingModule { }
