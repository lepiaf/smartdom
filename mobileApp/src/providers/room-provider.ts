import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiProvider } from './api-provider';

@Injectable()
export class RoomProvider {
  public temperatures = {
    livingroom: 0,
    bedroom: 0
  }

  public humidities = {
    livingroom: 0,
    bedroom: 0
  }

  constructor(public api: ApiProvider) {}

  public getTemperatures() {
    return new Promise((resolve,reject) => {
      this.api.get("/nodes/4/sensors/5/temperature")
        .subscribe(data => {
          this.temperatures.livingroom = data.json().last;

          this.api.get("/nodes/7/sensors/3/temperature")
            .subscribe(data => {
              this.temperatures.bedroom = data.json().last;

              resolve(this.temperatures);
            });
          });
    });
  }

  public getTemperature(nodeId: number, sensorId: number) {
    return this.api.get("/nodes/"+nodeId+"/sensors/"+sensorId+"/temperature");
  }

  public getHumidities() {
    return new Promise((resolve,reject) => {
      this.api.get("/nodes/4/sensors/4/humidity")
        .subscribe(data => {
          this.humidities.livingroom = data.json().last;

          this.api.get("/nodes/7/sensors/2/humidity")
            .subscribe(data => {
              this.humidities.bedroom = data.json().last;

              resolve(this.humidities);
            });
          });
    });
  }

  public getHumidity(nodeId: number, sensorId: number) {
    return this.api.get("/nodes/"+nodeId+"/sensors/"+sensorId+"/humidity");
  }

  public getPower() {
    return this.api.get("/power");
  }

  public getPowerPeriod() {
    return this.api.get("/power/period");
  }

  public updateSwitchState(nodeId: number, sensorId: number, state: number) {
    let body = {state: state};

    return this.api.update("/nodes/"+nodeId+"/sensors/"+sensorId, body);
  }

  public sendButton(nodeId: number, sensorId: number, button: number) {
    let body = {button: button};

    return this.api.update("/nodes/"+nodeId+"/remotes/"+sensorId, body);
  }
}
