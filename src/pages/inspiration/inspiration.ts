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
  public verseText: string;
  public verse    : string;
  constructor(public navCtrl: NavController, public app: App, public toastCtrl: ToastController, private socialSharing: SocialSharing) {
    this.currentDate = new Date();
    this.verse   = "James 1:2-4";
    this.verseText = "Consider it all joy, my brethren, when you encounter various trials, knowing that the testing of your faith produces endurance. And let endurance have its perfect result, so that you may be perfect and complete, lacking in nothing.";
    this.subject = "Daily Verse - " + this.verse + " | fellowship";
    this.message = this.verseText + "\n -- " + this.verse + "\n [Daily Verse by fellowship]";
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
          message: 'Was not able to share via Email',
          duration: 1500,
          position: 'middle'
        });
        toast.present();
        console.log('Was not able to share via Email');
      });
    })
    .catch((err) => {
      let toast = this.toastCtrl.create({
        message: 'Unable to share via Email',
        duration: 1500,
        position: 'middle'
      });
      toast.present();
      console.log('Unable to share via Email');
    });
   }

   shareViaSMS() {
      this.socialSharing.shareViaSMS(this.message, null)
      .then((data) => {
        console.log('Shared via SMS');
      })
      .catch((err) => {
        let toast = this.toastCtrl.create({
          message: 'Was not able to share via SMS.',
          duration: 1500,
          position: 'middle'
        });
        toast.present();
        console.log('Was not able to share via SMS');
      });
   }
}
