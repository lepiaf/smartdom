import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Constant} from '../../constant';

@Component({
  selector: 'page-tv',
  templateUrl: 'tv.html',
  providers: [Constant]
})
export class TvPage {
  private http;
  constructor(http: Http, nav: NavController, public viewCtrl: ViewController) {
    this.http = http;
  }

  public sendButton(remoteId: number, button: number)
  {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': Constant.TOKEN});
    let options = new RequestOptions({ headers: headers });
    let body = {button: button};

    this.http.put(Constant.API_ENDPOINT+"/nodes/3/remotes/"+remoteId, JSON.stringify(body), options)
      .subscribe(data => {
      });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
