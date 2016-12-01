import { Component } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { RoomProvider } from '../../providers/room-provider';
import { Remote } from '../remote';

@Component({
  selector: 'page-hdmi',
  templateUrl: 'hdmi.html'
})

export class HdmiPage extends Remote {
  constructor(
    public room: RoomProvider,
    nav: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
  ) {
    super(room, nav, viewCtrl, toastCtrl);
  }
}
