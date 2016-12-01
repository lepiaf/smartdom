import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {Constant} from '../../constant';
import { ActionSheetController } from 'ionic-angular';
import { LedPage } from '../led/led';
import { ModalController } from 'ionic-angular';
import { BaseHomePage } from '../home/base-home';
import { HeaterProvider } from '../../providers/heater-provider';
import { RoomProvider } from '../../providers/room-provider';

@Component({
  selector: 'page-bedroom',
  templateUrl: 'bedroom.html',
  providers: [Constant]
})

export class BedroomPage extends BaseHomePage {
  constructor(
    nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public heater: HeaterProvider,
    public room: RoomProvider,
    public modalCtrl: ModalController
  ) {
    super(nav, actionSheetCtrl, toastCtrl, heater, room);
    this.init();
  }

  public presentModalLed() {
    let modal = this.modalCtrl.create(LedPage);
    modal.present();
  }
}
