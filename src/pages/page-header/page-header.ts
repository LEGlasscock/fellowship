import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { InspirationPage } from '../inspiration/inspiration';

@Component({
  selector: 'page-header',
  templateUrl: 'page-header.html'
})
export class HeaderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  
  goToHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  goToInspirationPage() {
    this.navCtrl.setRoot(InspirationPage);
  }
  goToProfilePage() {
    this.navCtrl.setRoot(ProfilePage);
  }

}