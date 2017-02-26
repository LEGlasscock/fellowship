import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController, Tabs, App } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { PrayPage } from '../pray/pray';

import firebase from 'firebase';

@Component({
  selector: 'page-request',
  templateUrl: 'request.html'
})
export class RequestPage {
  private prayerRequest: FormGroup;
  newPrayerRequest: any;

  constructor( private formBuilder: FormBuilder, public navCtrl: NavController, public authData: AuthData, public app: App) {
    this.prayerRequest = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      anonymous: ['false']
    });
  }

  submitRequest() {
    //set values
    let prayer = this.prayerRequest.value;

    // Get user ID
    let user = firebase.auth().currentUser.uid;

    // Get user info
    let userInfo = firebase.database().ref('userProfile').child(user); //url to firebase/userProfile/userId
    let userName;
    userInfo.once("value", function(data) {
      userName = data.val().firstName + " " + data.val().lastName;
      //can set other values here too...such as an image if there is one
      console.log("User: " + userName);

      // Get a new key for new prayer request
      let newPostKey = firebase.database().ref('prayers').push().key;

      // Set timestamp ... only sets once pushed to firebase
      let dateCreated = firebase.database.ServerValue.TIMESTAMP;

      firebase.database().ref('prayers').child(newPostKey).set({
        message: prayer.message,
        requestor: user,
        timestamp: dateCreated,
        title: prayer.title,
        anonymous: prayer.anonymous,
        userName: userName
      });
      // A post entry.
      let postData = {
        message: prayer.message,
        requestor: user,
        timestamp: dateCreated,
        title: prayer.title,
        anonymous: prayer.anonymous,
        userName: userName
      };
      console.log('Post Data: ' + JSON.stringify(postData));
    });

    console.log("Prayer request created " + JSON.stringify(this.prayerRequest.value));

    this.app.getRootNav().getActiveChildNav().select(0);
  }

  logMeOut() {
    this.authData.logoutUser().then( () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
