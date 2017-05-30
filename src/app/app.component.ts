import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadPage } from '../pages/load/load';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';

import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoadPage;
  currentUserId: any;
  userInfo: any;
  pages: Array<{title: string, component: any, icon: any}>;

  constructor(platform: Platform, public app: App, public statusBar: StatusBar) {
    // Need to modify this to change depending on user role
    this.pages = [
      { title: 'Profile', component: ProfilePage, icon: 'person' },
      // { title: 'Test Admin Page', component: HomePage },
      // { title: 'Test Staff Page', component: HomePage }
    ];

    const config = {
      apiKey: "AIzaSyCtmNyCpdS2xkN0zAoQqmx0z-kDV8hlYSs",
      authDomain: "powerofprayer-10103.firebaseapp.com",
      databaseURL: "https://powerofprayer-10103.firebaseio.com",
      storageBucket: "powerofprayer-10103.appspot.com",
      messagingSenderId: "1053347134753"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged( user => {
        if (!user) { //user not logged in
          this.nav.setRoot(LoginPage);
          console.log("There's not a logged in user!");
        }
        else { //user already logged in
          this.nav.setRoot(HomePage);
        }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Main app.component');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logMeOut() {
    firebase.auth().signOut().then( () => {
      this.nav.setRoot(LoginPage);
    });
  }
}
