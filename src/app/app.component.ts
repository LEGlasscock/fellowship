import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';


import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  zone: NgZone;

  constructor(platform: Platform) {

    const config = {
      apiKey: "AIzaSyCtmNyCpdS2xkN0zAoQqmx0z-kDV8hlYSs",
      authDomain: "powerofprayer-10103.firebaseapp.com",
      databaseURL: "https://powerofprayer-10103.firebaseio.com",
      storageBucket: "powerofprayer-10103.appspot.com",
      messagingSenderId: "1053347134753"
    };
    firebase.initializeApp(config);

    this.zone = new NgZone({});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run( () => {
        if (!user) {
          this.rootPage = LoginPage; 
          unsubscribe();
        } else { 
          this.rootPage = TabsPage; 
          unsubscribe();
        }
      });     
    });

    firebase.auth().onAuthStateChanged( user => {
      if (!user) {
        this.rootPage = LoginPage;
        console.log("There's not a logged in user!");
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
