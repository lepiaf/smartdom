import { NavController, ViewController, ToastController } from 'ionic-angular';
import { RoomProvider } from '../providers/room-provider';

export class Remote {
  constructor(
    public room: RoomProvider,
    nav: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
  ) {}

  public sendButton(nodeId: number, sensorId: number, button: number) {
    this.room.sendButton(nodeId, sensorId, button).subscribe(data => {
      let toast = this.toastCtrl.create({
        message: "Bouton appuyé"  ,
        duration: 3000
      });
      toast.present();
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
