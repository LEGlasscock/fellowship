import { Component } from '@angular/core';
import { NavController, App, ToastController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
  selector: 'page-inspiration',
  templateUrl: 'inspiration.html'
})
export class InspirationPage {

  constructor(public navCtrl: NavController, public app: App, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspirationPage');
  }


}
