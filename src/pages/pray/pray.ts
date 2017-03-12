import { Component } from '@angular/core';

import { NavController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../login/login';

import firebase from 'firebase';

@Component({
  selector: 'page-pray',
  templateUrl: 'pray.html'
})
export class PrayPage {
  public prayerList: any;
  public newPrayerList: any;
  public currentUserId: any;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public authData: AuthData) {
  }

  refreshPrayerList() {
    this.prayerList = firebase.database().ref('prayers');
    console.log(this.prayerList);
    let arr = [];
    this.prayerList.orderByChild("timestamp").limitToLast(10).once("value", function(prayer) {
      prayer.forEach(function(data) {
          arr.push(data.val());
          console.log("The message UID is: " + data.key);
      });
      console.log(arr);
      arr = arr.reverse(); //reverse array to show timestamp in descending order
    });
    this.newPrayerList = arr;
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.refreshPrayerList();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }

  ionViewWillLoad() {
    this.refreshPrayerList();
  }
  
  logMeOut() {
    this.authData.logoutUser().then( () => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  openModal(item) {
      let modal = this.modalCtrl.create(ModalContentPage, item);
      modal.present();
  }
}

@Component({
  template: `
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>
      Prayer Request
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
    <ion-item>
    <ion-avatar item-left>
        <img src="{{prayer.userImage}}">
    </ion-avatar>
    <h2>{{prayer.userName}}</h2>
    </ion-item>

    <ion-card>
      <ion-card-header style="font-weight: bold;">
        {{prayer.title}}
      </ion-card-header>
      <ion-card-content>
        {{prayer.message}}
      </ion-card-content>
    </ion-card>
    <ion-item>
      <img src="assets/img/prayer_hands.png" style="width: auto;margin: auto;display: block;">
    </ion-item>
    <ion-item>
      <h1 style="text-align:center;font-weight:bold;">{{prayer.count}}</h1>
    </ion-item>
</ion-content>
`
})
export class ModalContentPage {
  prayer;

  constructor( public platform: Platform, public params: NavParams, public viewCtrl: ViewController ) {

    // let prayers = [
    //   {
    //     name: 'Chad Jarvis',
    //     image: 'assets/img/man1.jpg',
    //     title: 'Need prayers for my nephew', 
    //     content: 'My nephew was recently diagnosed with cancer yesterday. They told him that he only has 12 months.  We are asking for any and all prayers. ',
    //     count: '12'
    //   },
    //   {
    //     name: 'Sarah Robles',
    //     image: 'assets/img/woman1.jpg',
    //     title: 'Getting married', 
    //     content: 'I would like to ask for prayers of blessing for our future.  My best friend of many years has just proposed, and I ask that God bless our union.',
    //     count: '7'
    //   },
    //   {
    //     name: 'Ben Lancaster',
    //     image: 'assets/img/man2.jpg',
    //     title: 'Please pray for my Family', 
    //     content: 'My parents lost their house in a recent house fire.  Many of their belongings were destroyed, and they are devastated.  Please pray for comfort.',
    //     count: '24'
    //   }
    // ];
    this.prayer = this.params.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

//EXAMPLE CODE FOR TROUBLESHOOTING

    // //displays json object at https://powerofprayer-10103.firebaseio.com/prayers
    // firebase.database().ref('prayers').once('value', snapshot => console.log(snapshot.val()));

    // this.prayerList.orderByChild("timestamp").on("child_added", function(data) {
    //   console.log("The message UID is: " + data.key);
    //   console.log("The requestor is: " + data.val().requestor);
    //   console.log("The timestamp is: " + data.val().timestamp);
    //   console.log("The title is: " + data.val().title);
    //   console.log("The message is: " + data.val().message);
    // });

    // this.currentUser = firebase.auth().currentUser.uid;
    // console.log("User Logged into PrayPage: " + JSON.stringify(this.currentUser)); //displays current user's uid
    // console.log("User Logged into PrayPage: " + this.prayerList); //displays https://powerofprayer-10103.firebaseio.com/prayers link