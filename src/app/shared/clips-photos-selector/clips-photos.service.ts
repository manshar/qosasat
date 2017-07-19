import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const PER_PAGE = 50;
const CARBON_SRCSRC_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/';
const CARBON_SRCSRC_SEARCH_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/search';

@Injectable()
export class ClipsPhotosService {
  constructor(private http: Http) { }

  nextSearchUrl:string = CARBON_SRCSRC_SEARCH_ENDPOINT;
  search() {
    return this.http.get(this.nextSearchUrl, {
      params: {
        'q': '',
      }
    }).map(res => {
      const response = res.json();
      this.nextSearchUrl = response.next_url;
      return response;
    });
  }

  nextSearch() {
    if (!this.nextSearchUrl) {
      this.nextSearchUrl = CARBON_SRCSRC_SEARCH_ENDPOINT;
    }
    return this.search();
  }


  nextListUrl:string = CARBON_SRCSRC_ENDPOINT;
  list() {
    return this.http.get(this.nextListUrl, {
      params: {
        'order': '-source_created_at',
        'limit': PER_PAGE,
        // 'categories': [],
        // 'colors': [],
        // 'tags': [],
      },
    }).map(res => {
      const response = res.json();
      this.nextListUrl = response.next_url;
      return response;
    });
  }

  nextList() {
    if (!this.nextListUrl) {
      this.nextListUrl = CARBON_SRCSRC_ENDPOINT;
    }
    return this.list();
  }
}
