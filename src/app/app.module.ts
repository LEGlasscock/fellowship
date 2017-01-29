import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { RequestPage } from '../pages/request/request';
import { ContactPage } from '../pages/contact/contact';
import { PrayPage } from '../pages/pray/pray';
import { ModalContentPage } from '../pages/pray/pray';
import { TabsPage } from '../pages/tabs/tabs';

//Import Login Pages
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';

// Import Providers
import { AuthData } from '../providers/auth-data';

@NgModule({
  declarations: [
    MyApp,
    RequestPage,
    ContactPage,
    PrayPage,
    TabsPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ModalContentPage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{tabsPlacement: 'bottom'})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RequestPage,
    ContactPage,
    PrayPage,
    TabsPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ModalContentPage
  ],
  providers: [
    AuthData
  ]
})
export class AppModule {}
