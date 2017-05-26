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
  public userStorage: any;
  public userProfileStorage: any;
  private profileForm: FormGroup;
  public base64Image: string = '';
  public currentUserId: any;
  public name: any;
  public birthDay: any;
  public gender: string;
  public profilePicUrl: any;
  public dateCreated: any;
  public currentProfilePicUrl: any;

  constructor(public nav: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private camera: Camera) {

    this.userStorage = firebase.storage().ref('/userProfile/'); //Used for storing image files
    this.fireAuth = firebase.auth(); // We are creating an auth reference.

    // This declares a database reference for the userProfile/currentUserId node.
    this.userProfile = firebase.database().ref('/userProfile/');
    //this.userProfileStorage = firebase.storage().ref('/userProfile' + this.currentUserId + '/profilePic_' + this.currentUserId + '.jpg');
    //form
    this.profileForm = formBuilder.group({
        name: ['', Validators.required],
        gender: ['',],
        birthDay: ['', Validators.required],
        profilePic: ['',]
    });
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
      this.birthDay = dataInfo.birthDay;
      this.currentProfilePicUrl = dataInfo.profilePicUrl;
      if (this.currentProfilePicUrl != '' && this.currentProfilePicUrl != null) {
        this.profileForm.patchValue({ 'profilePic': ' ' }); //used to identify currentProfilePicUrl exists, for later on
      }
    }).catch((error) => {
      let toast = this.toastCtrl.create({
        message: 'Unable to load page.',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
    });
  }

  getImageUrl() {
    this.userStorage.child(this.currentUserId + "/" + this.currentUserId + "_" + this.dateCreated).getDownloadURL()
    .then((url) => {
        // Define url to later be inserted into an <img> tag to "download"
        this.profilePicUrl = url;
        console.log("profilePicUrl: " + this.profilePicUrl);
      }).catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object_not_found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }

  accessGallery(){
    this.dateCreated = Date.now();
   this.camera.getPicture({
     sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
     destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
     }, (err) => {
       let toast = this.toastCtrl.create({
        message: 'Unable to get image.',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
      console.log("Unable to get image (accessGallery): " + err);
    });
  }

  takePicture(){
    this.dateCreated = Date.now();
    this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 150,
        targetHeight: 150
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
        let toast = this.toastCtrl.create({
          message: 'Unable to get image.',
          duration: 1000,
          position: 'middle'
        });
        toast.present();
        console.log("Unable to get image (takePicture): " + err);
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
    this.dateCreated = Date.now();
    let input = this.fileInput.nativeElement;
    var reader = new FileReader();
    reader.onload = (readerEvent) => {
      input.parentNode.removeChild(input);
      this.base64Image = (readerEvent.target as any).result;
      this.profileForm.patchValue({ 'profilePic': this.base64Image });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    if (this.currentProfilePicUrl != '' && this.currentProfilePicUrl != null && this.profileForm.controls.profilePic.value == ' ') {
      return 'url(' + this.currentProfilePicUrl + ')';
    }
    else {
      return 'url(' + this.profileForm.controls['profilePic'].value + ')';
    }
  }

  editProfile() {
    let profile = this.profileForm.value;
    if (profile.name == "" || profile.name == null) {
      let toast = this.toastCtrl.create({
        message: 'Please add name.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return false;
    }
    else if (profile.name.match(/[^A-Za-z ]/)) {
      let toast = this.toastCtrl.create({
        message: 'Name must only include letters A through Z.',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
      return false;
    }
    
    //if base64Image exists then update
    if (this.base64Image != '' && this.base64Image != null) {
      //add image to firebase storage
      this.userStorage.child(this.currentUserId + "/" + this.currentUserId + "_" + this.dateCreated)
      .putString(this.base64Image, 'data_url')
      .then((snapshot) => {
        console.log('Uploaded image!');
        //get image url after uploading the image
        this.userStorage.child(this.currentUserId + "/" + this.currentUserId + "_" + this.dateCreated).getDownloadURL()
        .then((url) => {
          // Define url to later be inserted into an <img> tag to "download"
          this.profilePicUrl = url;
          console.log("profilePicUrl: " + this.profilePicUrl);
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object_not_found':
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        })
        .then(() => {
          this.userProfile.child(this.currentUserId).update({
            name: profile.name,
            gender: profile.gender,
            birthDay: profile.birthDay,
            profilePicUrl: this.profilePicUrl
          })
          .then(() => {
            let toast = this.toastCtrl.create({
              message: 'Saved...',
              duration: 1000,
              position: 'middle'
            });
            toast.present();
            console.log("User data saved.");
            this.nav.setRoot(ProfilePage);
          })
          .catch( err => {
            let toast = this.toastCtrl.create({
              message: 'Unable to save data.',
              duration: 1000,
              position: 'middle'
            });
            toast.present();
            console.log("Unable to save data to database (editProfile): " + err);
          });
        });
      })
      .catch( err => {
        console.log( err );
      })
    }
    else {
      this.userProfile.child(this.currentUserId).update({
        name: profile.name,
        gender: profile.gender,
        birthDay: profile.birthDay,
      })
      .then(() => {
          let toast = this.toastCtrl.create({
            message: 'Saved...',
            duration: 1000,
            position: 'middle'
          });
          toast.present();
          console.log("User data saved.");
          this.nav.setRoot(ProfilePage);
        })
        .catch( err => {
          let toast = this.toastCtrl.create({
            message: 'Unable to save data.',
            duration: 1000,
            position: 'middle'
          });
          toast.present();
          console.log("Unable to save data to database (editProfile): " + err);
        });
    }
  }

}
