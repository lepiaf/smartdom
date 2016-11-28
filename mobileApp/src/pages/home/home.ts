import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Constant} from '../../constant';
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

  constructor(http: Http, nav: NavController) {
    this.http = http;
    this.getTemperature();
    this.getHeater();
    Observable.interval(15000)
      .subscribe((x) => {
        this.getTemperature();
        this.getHeater();
      });
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
}
