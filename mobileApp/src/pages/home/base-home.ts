import { NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ActionSheetController } from 'ionic-angular';
import { HeaterProvider } from '../../providers/heater-provider';
import { RoomProvider } from '../../providers/room-provider';

export class BaseHomePage {
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

  constructor(
    nav: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public heater: HeaterProvider,
    public room: RoomProvider
  ) {

  }

  public init() {
    this.getTemperature();
    this.getHeater();
    Observable.interval(15000)
      .subscribe((x) => {
        this.getTemperature();
        this.getHeater();
      });
  }

  public displayHeaterMode(room: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Mode de chauffage pour '+this.heater.getLabelForHeaterRoom(room),
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

  public getTemperature() {
    this.room.getTemperatures().then((data: any) => {
      this.livingroom.temperature = data.livingroom;
      this.bedroom.temperature = data.bedroom;
    });
  }

  public updateHeaterMode(room: string, mode: string) {
    this.heater.changeMode(room, mode).subscribe(data => {
      this.getHeater();
      this.displayToastHeater(room, mode);
    });
  }

  public getHeater() {
    this.heater.getStates().then((data: any) => {
      this.livingroom.heaters = data.livingroom;
      this.bedroom.heater = data.bedroom;
    });
  }

  public sendButton(nodeId: number, sensorId: number, button: number) {
    console.log('send button');
    this.room.sendButton(nodeId, sensorId, button).subscribe(data => {
      let toast = this.toastCtrl.create({
        message: "Bouton appuyé"  ,
        duration: 3000
      });
      toast.present();
    });
  }

  public updateSwitchState(nodeId: number, sensorId: number, button: number) {
    console.log("update switch");
    this.room.updateSwitchState(nodeId, sensorId, button).subscribe(data => {
      let toast = this.toastCtrl.create({
        message: "Interrupteur "+(button === 1 ? 'allumé' : 'éteint'),
        duration: 3000
      });
      toast.present();
    });
  }

  private displayToastHeater(room: string, mode: string) {
    let toast = this.toastCtrl.create({
      message: "Chauffage "+this.heater.getLabelForHeaterRoom(room)+ " en mode "+mode,
      duration: 3000
    });
    toast.present();
  }
}
