import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private prayerRequest: FormGroup;
  public prayerList: any;
  public newPrayerList: any;
  public currentUserId: any;
  public liked: any = '';

  constructor(public navCtrl: NavController, public authData: AuthData, public loadingCtrl: LoadingController, 
              public toastCtrl: ToastController, private formBuilder: FormBuilder, public actionSheetCtrl: ActionSheetController,
              public splashScreen: SplashScreen) {
    this.currentUserId = firebase.auth().currentUser.uid;
    console.log("Current UserId: " + this.currentUserId);
    this.prayerRequest = this.formBuilder.group({
      message: ['',],
    });
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
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
    this.prayerList.orderByChild("timestamp").limitToLast(20).once("value", function(prayer) {
      prayer.forEach(function(data) {
          arr.push(data.val());
          console.log("The message UID is: " + data.key);
      })
        console.log(arr);
        arr = arr.reverse(); //reverse array to show timestamp in descending order
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

  submitRequest() {
    // Get user ID
    let userId = firebase.auth().currentUser.uid;
    //set values
    let prayer = this.prayerRequest.value;
    if (prayer.message == "" || prayer.message == null) {
      let toast = this.toastCtrl.create({
        message: 'Add prayer message before submitting.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return false;
    }
    else if (prayer.message.length < 20) {
      let toast = this.toastCtrl.create({
        message: 'Message must be at least 20 characters.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return false;
    }
    else if (prayer.message.length > 600) {
      let toast = this.toastCtrl.create({
        message: 'Message must be less than 600 characters.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return false;
    }
    // Get user info
    let userInfo = firebase.database().ref('userProfile').child(this.currentUserId); //url to firebase/userProfile/userId
    
    userInfo.once("value", function(data) {
      let userName = data.val().name;
      let profilePicUrl = data.val().profilePicUrl;
      let prayerCount = 0;
      console.log("User: " + userName);

      // Get a new key for new prayer request
      let newPostKey = firebase.database().ref('prayers').push().key;
      // Set timestamp ... only sets once pushed to firebase
      let dateCreated = firebase.database.ServerValue.TIMESTAMP;

      firebase.database().ref('prayers').child(newPostKey).set({
        message: prayer.message,
        requestor: userId,
        timestamp: dateCreated,
        userName: userName,
        profilePicUrl: profilePicUrl,
        prayerCount: prayerCount,
        requestUid: newPostKey,
        prayers: {placeholder: 0}
      });
    });
    console.log("Current UserId: " + this.currentUserId);
    this.prayerRequest.reset(); //reset form
    this.refreshPrayerList();
    console.log("Prayer request created " + JSON.stringify(this.prayerRequest.value));
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
          text: 'Report',
          role: 'report',
          handler: () => {
            firebase.database().ref('prayers/' + item.requestUid + '/reported').child(this.currentUserId).set(1);
            let toast = this.toastCtrl.create({
              message: 'Message reported.',
              duration: 1000,
              position: 'middle'
            });
            toast.present();
            console.log('Report clicked');
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