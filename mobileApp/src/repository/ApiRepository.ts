import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Constant} from '../constant';
import { Inject } from '@angular/core';

@Injectable()
export class ApiRepository{

  private http;

  constructor(@Inject('Http') http: Http)
  {
    this.http = http;
  }

  public update(url: string, body: any)
  {
    return this.http.put(Constant.API_ENDPOINT+url, JSON.stringify(body), this.getRequestOptions());
  }

  private getRequestOptions()
  {
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': Constant.TOKEN});
    let options = new RequestOptions({ headers: headers });

    return options;
  }
}
