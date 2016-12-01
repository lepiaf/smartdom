import { Component } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { RoomProvider } from '../../providers/room-provider';
import { Remote } from '../remote';

@Component({
  selector: 'page-led',
  templateUrl: 'led.html'
})

export class LedPage extends Remote {
  constructor(
    public room: RoomProvider,
    nav: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
  ) {
    super(room, nav, viewCtrl, toastCtrl);
  }
}
