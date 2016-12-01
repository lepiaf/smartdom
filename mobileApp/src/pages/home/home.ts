import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { HeaterProvider } from '../../providers/heater-provider';
import { RoomProvider } from '../../providers/room-provider';
import { BaseHomePage } from './base-home';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage extends BaseHomePage {
  constructor(
    nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public heater: HeaterProvider,
    public room: RoomProvider
  ) {
    super(nav, actionSheetCtrl, toastCtrl, heater, room);

    this.init();
  }
}
