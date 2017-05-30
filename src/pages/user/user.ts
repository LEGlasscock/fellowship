import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';

import firebase from 'firebase';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
  private prayerRequest: FormGroup;
  public prayerList: any;
  public newPrayerList: any;
  public currentUserId: any;
  public liked: any = '';

  constructor(public navCtrl: NavController, public authData: AuthData, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, private formBuilder: FormBuilder, public actionSheetCtrl: ActionSheetController) {
    this.currentUserId = firebase.auth().currentUser.uid;
    console.log("Current UserId: " + this.currentUserId);
    this.prayerRequest = this.formBuilder.group({
      message: ['',],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  
  refreshPrayerList() {
    console.log('refreshPrayerList');
    this.prayerList = firebase.database().ref('prayers');
    let arr = [];
    let loading = this.loadingCtrl.create({
      content: '',
      duration: 3000
    });
    loading.present();

    this.prayerList.orderByChild("requestor").equalTo(this.currentUserId).limitToLast(10)
    .once("value", function(prayer) {
      prayer.forEach(function(data) {
          arr.push(data.val());
          console.log("The message UID is: " + data.key);
      })
      console.log(arr);
      //sort by most recent timestamp
      arr.sort(function(a,b) {return (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0);} ); 
    })
    .then(() => {
      loading.dismiss();
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
    console.log('ionViewWillLoad HomePage');
    this.refreshPrayerList();
  }

  prayFor(item, i) {
    let userId = this.currentUserId;
    if (!item.prayers.hasOwnProperty(this.currentUserId)) { //not prayed for
      firebase.database().ref('prayers/' + item.requestUid + '/prayers').child(this.currentUserId).set(1);
      firebase.database().ref('prayers/' + item.requestUid + '/prayerCount').transaction((currentCount) => {
        return currentCount + 1;
      });
      let newObj = {[userId]: 1};
      this.newPrayerList[i].prayers = Object.assign(this.newPrayerList[i].prayers, newObj); 
      this.newPrayerList[i].prayerCount++;
      console.log("check if: " + JSON.stringify(this.newPrayerList[i].prayers));
    }
    else { //prayed for
      firebase.database().ref('prayers/' + item.requestUid + '/prayers').child(this.currentUserId).set(null);
      firebase.database().ref('prayers/' + item.requestUid + '/prayerCount').transaction((currentCount) => {
        return currentCount - 1;
      });
      delete this.newPrayerList[i].prayers[userId]; //remove userId from prayers object
      this.newPrayerList[i].prayerCount--;
      console.log("check else: " + JSON.stringify(this.newPrayerList[i].prayers));
    }
  }

  presentActionSheet(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Delete',
          role: 'delete',
          handler: () => {
            firebase.database().ref('prayers/' + item.requestUid).set(null);
            console.log('Deleted message.');
            this.refreshPrayerList();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}