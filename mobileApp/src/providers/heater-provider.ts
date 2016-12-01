import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiProvider } from './api-provider';

@Injectable()
export class HeaterProvider {
  private states = {
    livingroom: {
      left: "stop",
      right: "stop"
    },
    bedroom: "stop"
  }

  constructor(public api: ApiProvider) {}

  public getStates() {
    return new Promise((resolve,reject) => {
      this.getState('salonGauche').subscribe(data => {
          this.states.livingroom.left = data.json().last;

          this.getState('salonDroite').subscribe(data => {
              this.states.livingroom.right = data.json().last;

              this.getState('chambre').subscribe(data => {
                  this.states.bedroom = data.json().last;

                  resolve(this.states);
              });
          });
      });
    });
  }

  public getState(room: string) {
    return this.api.get(this.getPath(room));
  }

  public changeMode(room: string, mode: string) {
    return this.api.update(this.getPath(room), {mode: mode});
  }

  public getLabelForHeaterRoom(room: string) {
    if (room == "salonGauche") {
      return "salon gauche";
    }

    if (room == "salonDroite") {
      return "salon droit";
    }

    return room;
  }

  private getPath(room: string) {
    return "/heaters/"+room;
  }
}
