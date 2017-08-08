import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const RENDER_SERVICE_BASE_URL = 'https://manshar-snacks.appspot.com';
// const RENDER_SERVICE_BASE_URL = 'http://localhost:8080';
const RENDER_SERVICE_URL: string =
    `${RENDER_SERVICE_BASE_URL}/generate/qosasa?preview=1`;
const RENDER_WITH_CHROME_SERVICE_URL: string =
    `${RENDER_SERVICE_BASE_URL}/render/chrome/qosasa?preview=1`;

@Injectable()
export class ClipRenderService {

  constructor(private http: Http) { }

  public render(config) {
    return this.http.post(RENDER_SERVICE_URL, config, {
      responseType: ResponseContentType.Blob,
    }).map((response) => {
        const blob = new Blob([response.blob()], {type: 'image/png'});
        return blob;
      });
  }

  public renderWithChrome(url, config) {
    return this.http.post(RENDER_WITH_CHROME_SERVICE_URL, {
      url,
      width: config.width,
      height: config.height,
    }, {
      responseType: ResponseContentType.Blob,
    }).map((response) => {
        const blob = new Blob([response.blob()], {type: 'image/png'});
        return blob;
      });
  }
}
