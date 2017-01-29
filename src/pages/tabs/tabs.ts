import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PrayPage } from '../pray/pray';
import { RequestPage } from '../request/request';
import { ContactPage } from '../contact/contact';

import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = PrayPage;
  tab2Root: any = RequestPage;
  tab3Root: any = ContactPage;

  constructor() {

  }

}
