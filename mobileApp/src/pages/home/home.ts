import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Constant} from '../../constant';
import { ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Constant]
})

export class HomePage {
  public livingroom = {
    temperature: 0,
    humidity: 0,
    heaters: {
      left: "stop",
      right: "stop"
    }
  };

  public bedroom = {
    temperature: 0,
    humidity: 0,
    heater: "stop"
  }

  private http;

  constructor(
    http: Http, nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
  ) {
    this.http = http;
    this.getTemperature();
    this.getHeater();
    Observable.interval(15000)
    .subscribe((x) => {
      this.getTemperature();
      this.getHeater();
    });
  }

  public displayHeaterMode(room: string)
  {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Mode de chauffage pour '+this.getLabelForHeaterRoom(room),
      buttons: [
        {
          text: 'Arrêt',
          icon: 'square-outline',
          handler: () => {
            this.updateHeaterMode(room, "stop");
          }
        }, {
          text: 'Economique',
          icon: 'ios-leaf-outline',
          handler: () => {
            this.updateHeaterMode(room, "eco");
          }
        }, {
          text: 'Confort',
          icon: 'ios-flame-outline',
          handler: () => {
            this.updateHeaterMode(room, "comfy");
          }
        }, {
          text: 'Annuler',
          role: 'cancel',
          icon: 'ios-close-outline',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public getTemperature()
  {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': Constant.TOKEN});
    let options = new RequestOptions({ headers: headers });

    this.http.get(Constant.API_ENDPOINT+"/nodes/4/sensors/5/temperature", options)
    .subscribe(data => {
      this.livingroom.temperature = data.json().last;

      this.http.get(Constant.API_ENDPOINT+"/nodes/7/sensors/3/temperature", options)
      .subscribe(data => {
        this.bedroom.temperature = data.json().last;
      });
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
  }

  public getHeater()
  {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': Constant.TOKEN});
    let options = new RequestOptions({ headers: headers });

    this.http.get(Constant.API_ENDPOINT+"/heaters/salonGauche", options)
    .subscribe(data => {
      this.livingroom.heaters.left = data.json().last;

      this.http.get(Constant.API_ENDPOINT+"/heaters/salonDroite", options)
      .subscribe(data => {
        this.livingroom.heaters.right = data.json().last;

        this.http.get(Constant.API_ENDPOINT+"/heaters/chambre", options)
        .subscribe(data => {
          this.bedroom.heater = data.json().last;
        });
      });
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
  }

  private displayToastHeater(room: string, mode: string)
  {
    let toast = this.toastCtrl.create({
      message: "Chauffage "+this.getLabelForHeaterRoom(room)+ " en mode "+mode,
      duration: 3000
    });
    toast.present();
  }

  private updateHeaterMode(room: string, mode: string)
  {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': Constant.TOKEN});
    let options = new RequestOptions({ headers: headers });
    let body = {mode: mode};

    this.http.put(Constant.API_ENDPOINT+"/heaters/"+room, JSON.stringify(body), options)
      .subscribe(data => {
        this.getHeater();
        this.displayToastHeater(room, mode);
      });
  }

  private getLabelForHeaterRoom(room: string)
  {
    if (room == "salonGauche") {
      return "salon gauche";
    }

    if (room == "salonDroite") {
      return "salon droit";
    }

    return room;
  }
}
