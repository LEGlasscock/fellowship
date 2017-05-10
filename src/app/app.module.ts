import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';

import { LoadPage } from '../pages/load/load';
import { HomePage } from '../pages/home/home';
//import { HomePage, ModalContentPage } from '../pages/home/home';
import { FooterPage } from '../pages/page-footer/page-footer';
import { RequestPage } from '../pages/request/request';
import { ProfilePage } from '../pages/profile/profile';

//Import Login Pages
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';

// Import Providers
import { AuthData } from '../providers/auth-data';

@NgModule({
  declarations: [
    MyApp,
    LoadPage,
    HomePage,
//    ModalContentPage,
    FooterPage,
    RequestPage,
    ProfilePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoadPage,
    HomePage,
//    ModalContentPage,
    FooterPage,
    RequestPage,
    ProfilePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage
  ],
  providers: [
    AuthData,
    StatusBar,
    SplashScreen,
    Camera
  ]
})
export class AppModule {}
