import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { AuthData } from '../../providers/auth-data';
import { Camera } from '@ionic-native/camera';

import firebase from 'firebase';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  @ViewChild('fileInput') fileInput;
  public fireAuth: any;
  public userProfile: any;
  public userProfileStorage: any;
  private profileForm: FormGroup;
  public base64Image: string;
  public currentUserId: any;
  public name: any;
  public birthDay: any;
  public gender: string;
  public email: string;
  public profilePicUrl: any;

  constructor(public nav: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private camera: Camera) {

    this.fireAuth = firebase.auth(); // We are creating an auth reference.

    // This declares a database reference for the userProfile/currentUserId node.
    this.userProfile = firebase.database().ref('/userProfile/');
    //this.userProfileStorage = firebase.storage().ref('/userProfile' + this.currentUserId + '/profilePic_' + this.currentUserId + '.jpg');
    //form
    this.profileForm = formBuilder.group({
        name: ['', Validators.required],
        gender: ['',],
        email: ['', Validators.required],
        phone: ['', Validators.required],
        birthDay: ['', Validators.required],
        profilePic: ['',]
      }) 
  }

  ionViewWillLoad() {
    let dataInfo;
    console.log('ionViewWillLoad ProfilePage');
    // Get user ID
    this.currentUserId = firebase.auth().currentUser.uid;
    console.log("currentUserId: " + this.currentUserId);
    console.log("userProfile_path: " + this.userProfile);
    this.userProfile.child(this.currentUserId).once('value', function(data) {
      dataInfo = data.val();
    })
    .then( () => {
      console.log(dataInfo);
      this.name = dataInfo.name;
      this.gender = dataInfo.gender;
      this.email = dataInfo.email;
      this.birthDay = dataInfo.birthDay;
    });
    
    // this.userProfileStorage.getDownloadURL().then(function(url) {
    //   this.profilePicUrl = url;
    //   // Insert url into an <img> tag to "download"
    // }).catch(function(error) {
    //   // A full list of error codes is available at
    //   // https://firebase.google.com/docs/storage/web/handle-errors
    //   switch (error.code) {
    //     case 'storage/object_not_found':
    //       // File doesn't exist
    //       break;
    //     case 'storage/unauthorized':
    //       // User doesn't have permission to access the object
    //       break;
    //     case 'storage/canceled':
    //       // User canceled the upload
    //       break;
    //     case 'storage/unknown':
    //       // Unknown error occurred, inspect the server response
    //       break;
    //   }
    // });
  }

  accessGallery(){
   this.camera.getPicture({
     sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
     destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,'+imageData;
      //add image to firebase
      this.userProfile.update({
        image: this.base64Image
      });
     }, (err) => {
      console.log(err);
    });
  }

  takePicture(){
    this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 150,
        targetHeight: 150
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        //add image to firebase
        this.userProfile.set({
          image: this.base64Image
        });
    }, (err) => {
        console.log(err);
    });
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 150,
        targetHeight: 150
      }).then((data) => {
        this.profileForm.patchValue({ 'profilePic': 'data:image/jpg;base64,' +  data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let input = this.fileInput.nativeElement;

    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      input.parentNode.removeChild(input);

      var imageData = (readerEvent.target as any).result;
      this.profileForm.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.profileForm.controls['profilePic'].value + ')'
  }

}
