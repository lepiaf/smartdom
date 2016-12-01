import { Component } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { RoomProvider } from '../../providers/room-provider';
import { Remote } from '../remote';

@Component({
  selector: 'page-bbox',
  templateUrl: 'bbox.html'
})

export class BboxPage extends Remote {
  constructor(
    public room: RoomProvider,
    nav: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
  ) {
    super(room, nav, viewCtrl, toastCtrl);
  }
}
