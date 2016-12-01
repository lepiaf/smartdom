import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constant } from '../constant';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {

  constructor(public http: Http) {}

  public get(url: string) {
    return this.http.get(this.getUrl(url), this.getRequestOptions());
  }

  public update(url: string, data: Object) {
    return this.http.put(this.getUrl(url), JSON.stringify(data), this.getRequestOptions());
  }

  public post(url: string, data: Object) {
    return this.http.put(this.getUrl(url), JSON.stringify(data), this.getRequestOptions());
  }

  private getUrl(url: string) {
    return Constant.API_ENDPOINT+url;
  }

  private getRequestOptions(): RequestOptions {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': Constant.TOKEN});
    let options = new RequestOptions({ headers: headers });

    return options;
  }
}
