import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Meal } from './meal.component';
import { AuthenticationService } from '../core/authentication/authentication.service';

const routes = {
  meal: (c: MealContext) => `/meal`
};

export interface MealContext {
  meal: Meal;
}

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
  userId: string;
}

@Injectable()
export class MealService {
  authToken: string;
  private _credentials: Credentials;
  constructor(private http: Http, private authService: AuthenticationService) { }
  saveMeal(meal: Meal): Observable<any> {
    console.log(meal);
    this._credentials = this.authService.credentials;
    this.authToken = this._credentials.token;
    console.log('CREDENTIALS -->', this._credentials);
    const authHeader = new Headers({'x-access-token': this.authToken, 'Access-Control-Allow-Origin': '*'});
    return this.http.post('/meal',
      {meal, username: this._credentials.username, userId: this._credentials.userId},
      {headers: authHeader} )
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not save meal :-('));
  }
  getMeals(): Observable<any> {
    this._credentials = this.authService.credentials;
    this.authToken = this._credentials.token;
    console.log('CREDENTIALS -->', this._credentials);
    const authHeader = new Headers({'x-access-token': this.authToken, 'Access-Control-Allow-Origin': '*'});
    return this.http.get('/meal/user/' + this._credentials.userId, {headers: authHeader} )
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not get meal :-('));
  }
  deleteMeal(mealId: string): Observable<any> {
    this._credentials = this.authService.credentials;
    this.authToken = this._credentials.token;
    console.log('CREDENTIALS -->', this._credentials);
    const authHeader = new Headers({'x-access-token': this.authToken, 'Access-Control-Allow-Origin': '*'});
    return this.http.delete('/meal/' + mealId + '/user/' + this._credentials.userId, {headers: authHeader} )
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not delete meal :-('));
  }
  updateMeal(meal: Meal): Observable<any> {
    console.log(meal);
    this._credentials = this.authService.credentials;
    this.authToken = this._credentials.token;
    console.log('CREDENTIALS -->', this._credentials);
    const authHeader = new Headers({'x-access-token': this.authToken, 'Access-Control-Allow-Origin': '*'});
    return this.http.put('/meal',
      {meal, username: this._credentials.username, userId: this._credentials.userId},
      {headers: authHeader} )
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not save meal :-('));
  }
}
