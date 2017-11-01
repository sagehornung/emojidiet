import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

const routes = {
  // quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`
  quote: (c: RandomQuoteContext) => '/quote'
};

export interface RandomQuoteContext {
  // The quote's category: 'nerdy', 'explicit'...
  category: string;
}

@Injectable()
export class QuoteService {

  constructor(private http: Http) { }

  getRandomQuote(context: RandomQuoteContext): Observable<any> {
    const h = new Headers({'Accept-Language': 'en-US'});
    return this.http.get('/quote', { cache: true, params: 'method=getQuote&format=json&lang=en'})
      .map((res: Response) => res.json())
      // .map(body => body.value)
      .catch(() => Observable.of('Error, could not load joke :-('));
  }
}
