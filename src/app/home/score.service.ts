import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../core/authentication/authentication.service';



export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
  userId: string;
}

@Injectable()
export class ScoresService {
  authToken: string;
  private _credentials: Credentials;
  constructor(private http: Http, private authService: AuthenticationService) { }
  getScores(): Observable<any> {
    this._credentials = this.authService.credentials;
    this.authToken = this._credentials.token;
    console.log('CREDENTIALS -->', this._credentials);
    const authHeader = new Headers({'x-access-token': this.authToken, 'Access-Control-Allow-Origin': '*'});
    return this.http.get('/scores/' + this._credentials.userId, {headers: authHeader} )
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not save meal :-('));
  }
}
