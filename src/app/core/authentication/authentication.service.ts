import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpModule } from '@angular/http';
import { HttpHeaders} from '@angular/common/http';

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
  userId: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

interface RequestOptionsArgs {
  headers?: Headers|null;
}
const credentialsKey = 'credentials';


const routes = {
  auth: (c: LoginContext) => `/authenticate`,
  register: (c: LoginContext) => `/users`
};

export interface LoginContext {
  // The quote's category: 'nerdy', 'explicit'...
  category: string;
}


/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  token: string;
  private _credentials: Credentials;
  private requestOptionArgs: RequestOptionsArgs;
  private headers: Headers;
  constructor(private http: Http) {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
    // this.requestOptionArgs.headers = new Headers({name: 'Authorization', value: 'Basic dGVzdEBnbWFpbC5jb206bHVuYQ=='});
  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  // login(context: LoginContext): Observable<Credentials> {
  //   // Replace by proper authentication call
  //   const data = {
  //     username: context.username,
  //     token: '123456'
  //   };
  //   this.setCredentials(data, context.remember);
  //   return Observable.of(data);
  // }

  //This is to authenitcare
  //Workign token --> Basic dGVzdEBnbWFpbC5jb206bHVuYQ==
  login(context: LoginContext): Observable<any> {
    const password = context.password;
    const username = context.username;
    const auth = 'Basic ' + btoa(username + ':' + password);
    console.log('PW & USER --> ', password, username);
    const h = new Headers({'Authorization': auth, 'Access-Control-Allow-Origin': '*'});
    return this.http.post(routes.auth(context),
      {}, {headers: h})
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json() && response.json().token;
        const userId = response.json() && response.json().userId;
        console.log('Response', response, 'Token', token);
        // token = 'abc123'
        if (token) {
          // set token property
          this.token = token;
          console.log('This is my token!!! ', token, context.username);
          const data = {
            username: context.username,
            token:  this.token,
            remember: true,
            userId: userId
          };
          console.log('DATA', data);
          this.setCredentials(data, context.remember);
          return Observable.of(data);
          // store username and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
          // return true to indicate successful login
          // return true;
        } else {
          // return false to indicate failed login
          // return false;
          return Observable.of(null);
        }
      });
  }

  //Works to /users == register
  register(context: LoginContext): Observable<any> {
    const password = context.password;
    const username = context.username;
    console.log('PW & USER --> ', password, username);
    return this.http.post(routes.register(context),
      { name: username, email: username, password: password })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json() && response.json().token;
        console.log('Response', response, 'Token', token);
        // token = 'abc123'
        if (token) {
          // set token property
          this.token = token;
          console.log('This is my token!!! ', token, context.username);
          const data = {
            username: context.username,
            token:  this.token,
            remember: true,
            userId: ''
          };
          console.log('DATA', data);
            this.setCredentials(data, context.remember);
            return Observable.of(data);
          // store username and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
          // return true to indicate successful login
          // return true;
        } else {
          // return false to indicate failed login
          // return false;
          return Observable.of(null);
        }
      });
  }
  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return Observable.of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

}
