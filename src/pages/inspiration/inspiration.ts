import { Component } from '@angular/core';
import { NavController, App, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import firebase from 'firebase';

@Component({
  selector: 'page-inspiration',
  templateUrl: 'inspiration.html'
})
export class InspirationPage {
  public currentDate: any;
  public sendTo   : any;
  public subject  : string; // = 'Message from Social Sharing App';
  public message  : string; // = 'Take your app development skills to the next level with Mastering Ionic - the definitive guide';
  public phone    : string; // = '9124328954';
  public image    : string; // = 'http://masteringionic.com/perch/resources/mastering-ionic-2-cover-1-w320.png';
  public uri      : string; // = 'http://masteringionic.com/products/product-detail/s/mastering-ionic-2-e-book';
  constructor(public navCtrl: NavController, public app: App, public toastCtrl: ToastController, private socialSharing: SocialSharing) {
    this.currentDate = new Date();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspirationPage');
  }

  shareViaEmail() {
    this.socialSharing.canShareViaEmail()
    .then(() => {
      this.socialSharing.shareViaEmail(this.message, this.subject, this.sendTo)
      .then((data) => {
        console.log('Shared via Email');
      })
      .catch((err) => {
        let toast = this.toastCtrl.create({
          message: 'Your email was not shared. Please try again.',
          duration: 1500,
          position: 'middle'
        });
        toast.present();
        console.log('Not able to be shared via Email');
      });
    })
    .catch((err) => {
      let toast = this.toastCtrl.create({
        message: 'Your email settings are not enabled.',
        duration: 1500,
        position: 'middle'
      });
      toast.present();
      console.log('Sharing via Email NOT enabled');
    });
   }

  shareViaFacebook() {
    this.socialSharing.canShareVia('com.apple.social.facebook', this.message, this.image, this.uri)
    .then((data) => {
      this.socialSharing.shareViaFacebook(this.message, this.image, this.uri)
      .then((data) => {
        console.log('Shared via Facebook');
      })
      .catch((err) => {
        let toast = this.toastCtrl.create({
          message: 'Your Facebook post was not shared. Please try again.',
          duration: 1500,
          position: 'middle'
        });
        toast.present();
        console.log('Was not shared via Facebook');
      });
    })
    .catch((err) => {
      let toast = this.toastCtrl.create({
        message: 'Your Facebook settings are not enabled.',
        duration: 1500,
        position: 'middle'
      });
      toast.present();
      console.log('Not able to be shared via Facebook');
    });
   }

   shareViaSMS() {
    this.socialSharing.canShareVia('sms', this.message, this.phone)
    .then((data) => {
      this.socialSharing.shareViaSMS(this.message, this.image)
      .then((data) => {
        console.log('Shared via SMS');
      })
      .catch((err) => {
        let toast = this.toastCtrl.create({
          message: 'Your message was not shared. Please try again.',
          duration: 1500,
          position: 'middle'
        });
        toast.present();
        console.log('Was not shared via SMS');
      });
    })
    .catch((err) => {
      let toast = this.toastCtrl.create({
        message: 'Text message option not available.',
        duration: 1500,
        position: 'middle'
      });
      toast.present();
      console.log('Not able to be shared via SMS');
    });
   }
}
