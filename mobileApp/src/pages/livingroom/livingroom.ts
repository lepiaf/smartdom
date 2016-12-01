import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {Constant} from '../../constant';
import { ActionSheetController } from 'ionic-angular';
import { BboxPage } from '../bbox/bbox';
import { HdmiPage } from '../hdmi/hdmi';
import { TvPage } from '../tv/tv';
import { ModalController } from 'ionic-angular';
import { HeaterProvider } from '../../providers/heater-provider';
import { RoomProvider } from '../../providers/room-provider';
import { BaseHomePage } from '../home/base-home';

@Component({
  selector: 'page-livingroom',
  templateUrl: 'livingroom.html',
  providers: [Constant]
})

export class LivingroomPage extends BaseHomePage {

  constructor(
    nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public heater: HeaterProvider,
    room: RoomProvider,
    public modalCtrl: ModalController
  ) {
    super(nav, actionSheetCtrl, toastCtrl, heater, room);
    this.init();
  }

  public presentModalBbox() {
    let modal = this.modalCtrl.create(BboxPage);
    modal.present();
  }

  public presentModalHdmi() {
    let modal = this.modalCtrl.create(HdmiPage);
    modal.present();
  }

  public presentModalTv() {
    let modal = this.modalCtrl.create(TvPage);
    modal.present();
  }
}
