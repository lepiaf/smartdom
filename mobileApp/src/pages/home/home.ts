import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { HeaterProvider } from '../../providers/heater-provider';
import { RoomProvider } from '../../providers/room-provider';
import { BaseHomePage } from './base-home';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage extends BaseHomePage {
  public power;
  public powerPeriod;
  public message;
  constructor(
    nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public heater: HeaterProvider,
    public room: RoomProvider
  ) {
    super(nav, actionSheetCtrl, toastCtrl, heater, room);

    this.init();

    this.getPower();
    this.getPowerPeriod();
    Observable.interval(15000)
      .subscribe((x) => {
        this.getPower();
        this.getPowerPeriod();
      });
  }

  public submit() {
    this.room.postMessage(this.message).subscribe(data => {
      let toast = this.toastCtrl.create({
        message: "Message envoyé"  ,
        duration: 3000
      });
      toast.present();
    });

  }

  public getPower() {
    this.room.getPower().subscribe(data => {
      this.power = data.json().last;
    })
  }

  public getPowerPeriod() {
    this.room.getPowerPeriod().subscribe(data => {
      this.powerPeriod = data.json().last;
    })
  }
}
