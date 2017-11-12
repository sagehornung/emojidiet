import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, Platform } from 'ionic-angular';

import { environment } from '../../environments/environment';
import { Logger } from '../core/logger.service';
import { I18nService } from '../core/i18n.service';
import { AuthenticationService } from '../core/authentication/authentication.service';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = environment.version;
  error: string = null;
  loginForm: FormGroup;
  isLoginPage: boolean;
  registrationMessage: string;
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private platform: Platform,
              private loadingController: LoadingController,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService) {
    this.createForm();
  }

  ngOnInit() {
    this.isLoginPage = true;
  }

  login() {
    const loading = this.loadingController.create();
    loading.present();
    log.info('Login Form:', this.loginForm.value);
    this.authenticationService.login(this.loginForm.value)
      .finally(() => {
        this.loginForm.markAsPristine();
        loading.dismiss();
      })
      .subscribe(credentials => {
        log.debug(`${credentials.username} successfully logged in`);
        this.router.navigate(['/'], { replaceUrl: true });
      }, error => {
        log.debug(`Login error: ${error}`);
        this.error = error;
      });
  }
  register() {
    const loading = this.loadingController.create();
    loading.present();
    log.info('Register Form:', this.loginForm.value);
    this.authenticationService.register(this.loginForm.value)
      .finally(() => {
        this.loginForm.markAsPristine();
        loading.dismiss();
      })
      .subscribe(credentials => {
        log.debug(`${credentials.username} something happened in register`);
        this.isLoginPage = true;
        this.registrationMessage = 'Success registering please login';
        this.router.navigate(['/login'], { replaceUrl: true });
      }, error => {
        log.debug(`Login error: ${error}`);
        this.registrationMessage = 'Something went wrong. Please tray again';
        this.error = error;
      });
  }

  toggleIsLoginPage() {
    this.isLoginPage = !this.isLoginPage;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }

}
