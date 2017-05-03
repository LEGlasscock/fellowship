import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RequestPage } from '../request/request';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-footer',
  templateUrl: 'page-footer.html'
})
export class FooterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  
  goToHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  goToRequestPage() {
    this.navCtrl.setRoot(RequestPage);
  }
  goToProfilePage() {
    this.navCtrl.setRoot(ProfilePage);
  }

}
