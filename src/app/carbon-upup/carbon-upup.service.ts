import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

const CARBON_UPUP_ENDPOINT = 'https://carbon-tools.appspot.com/api/v1/resource/upload/';

@Injectable()
export class CarbonUpUpService {
  constructor(public http: Http) {}
  public upload(file, onProgress) {
    return this.getUploadUrl_()
      .then(uploadUrl => {
        return this.upload_(uploadUrl, file, onProgress);
      });
  }

  private getUploadUrl_() {
    return new Promise((resolve, reject) => {
      this.http.get(CARBON_UPUP_ENDPOINT)
        .map(res => res.json())
        .subscribe(response => {
          var urlsArray = response.result.map(function(obj) {
            return obj.upload_url;
          });
          resolve(urlsArray[0]);
        }, errors => reject(errors));
    });
  }

  private updateProgress_(onProgress, event) {
    const loaded:number = parseFloat(event.loaded);
    const total:number = parseFloat(event.total);
    onProgress(loaded / total * 100.0);
  }

  addParamsToUrl(url, params) {
    if (!params) {
      return url;
    }

    var paramsArray = [];
    for (var key in params) {
      var value = encodeURIComponent(params[key]);
      paramsArray.push([key, value].join('='));
    }
    var paramsString = paramsArray.join('&');
    return [url, paramsString].join(
      url.indexOf('?') === -1 ? '?' : '&');
  }

  send(config) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          var json = JSON.parse(xhttp.responseText);
          if (config.onSuccess) {
            config.onSuccess(json);
          }
        } else {
          if (config.onError) {
            config.onError();
          }
        }
      }
    };

    if (config.onProgress) {
      xhttp.upload.onprogress = function(event) {
        config.onProgress(event);
      };
    }

    var endpoint = this.addParamsToUrl(config.url, config.params);
    xhttp.open(config.method || 'GET', endpoint, true);

    var data;
    if (config.body) {
      data = config.body;
    } else if (config.files) {
      data = new FormData();
      for (var i = 0; i < config.files.length; i++) {
        data.append('file', config.files[i], config.files[i].name || 'Untitled');
      }
    } else {
    }
    xhttp.send(data);
  }

  private upload_(uploadUrl, file, onProgress) {
    return new Promise((resolve, reject) => {
      this.send({
        url: uploadUrl,
        method: 'POST',
        files: [file],
        onSuccess: response => resolve(response),
        onError: error => reject(error),
        onProgress: this.updateProgress_.bind(this, onProgress),
      });
    });
  }
}
