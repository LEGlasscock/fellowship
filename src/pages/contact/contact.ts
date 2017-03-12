import { Component } from '@angular/core';
import { Camera } from 'ionic-native';

import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

import firebase from 'firebase';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  public base64Image: string;
  public currentUserId: any;
  constructor(public navCtrl: NavController, public authData: AuthData) {
  }

  accessGallery(){
   this.currentUserId = firebase.auth().currentUser.uid;
   Camera.getPicture({
     sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
     destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,'+imageData;
      //add image to firebase
      firebase.database().ref('userProfile').child(this.currentUserId).update({
        image: this.base64Image
      });
     }, (err) => {
      console.log(err);
    });
  }

  takePicture(){
    this.currentUserId = firebase.auth().currentUser.uid;
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        //add image to firebase
        firebase.database().ref('userProfile').child(this.currentUserId).set({
          image: this.base64Image
        });
    }, (err) => {
        console.log(err);
    });
  }

  logMeOut() {
    this.authData.logoutUser().then( () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
