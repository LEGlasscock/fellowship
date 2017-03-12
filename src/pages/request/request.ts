import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, App, ToastController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

import firebase from 'firebase';

@Component({
  selector: 'page-request',
  templateUrl: 'request.html'
})
export class RequestPage {
  private prayerRequest: FormGroup;

  constructor( private formBuilder: FormBuilder, public navCtrl: NavController, public authData: AuthData, 
    public app: App, public toastCtrl: ToastController) {
      
    this.prayerRequest = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      anonymous: ['false']
    });
  }

  submitRequest() {
    // Get user ID
    let currentUserId = firebase.auth().currentUser.uid;
    // Get user info
    let userInfo = firebase.database().ref('userProfile').child(currentUserId); //url to firebase/userProfile/userId
    //set values
    let prayer = this.prayerRequest.value;
    let userName;
    let userImage;
    userInfo.once("value", function(data) {
      userName = data.val().firstName + " " + data.val().lastName;
      userImage = data.val().image;
      console.log("User: " + userName);

      // Get a new key for new prayer request
      let newPostKey = firebase.database().ref('prayers').push().key;
      // Set timestamp ... only sets once pushed to firebase
      let dateCreated = firebase.database.ServerValue.TIMESTAMP;

      firebase.database().ref('prayers').child(newPostKey).set({
        message: prayer.message,
        requestor: currentUserId,
        timestamp: dateCreated,
        title: prayer.title,
        anonymous: prayer.anonymous,
        userName: userName,
        userImage: userImage
      });
    });
    setTimeout(() => {
      console.log('New prayer created.');
      //add toast popup message
      let toast = this.toastCtrl.create({
        message: 'Your prayer was created successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.prayerRequest.reset(); //reset form
    }, 1000);
    console.log("Prayer request created " + JSON.stringify(this.prayerRequest.value));
    
    // this.app.getRootNav().getActiveChildNav().select(0); //select first tab
  }

  logMeOut() {
    this.authData.logoutUser().then( () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
