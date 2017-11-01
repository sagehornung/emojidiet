import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Meal } from './meal.component';

const routes = {
  meal: (c: MealContext) => `/meal`
};

export interface MealContext {
  meal: Meal;
}

@Injectable()
export class MealService {

  constructor(private http: Http) { }
  saveMeal(meal: Meal): Observable<any> {
    console.log(meal);
    return this.http.post('/meal', {meal} )
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not save meal :-('));
  }
}
