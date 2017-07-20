import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import { Photo } from './clips-photo.model';

const PER_PAGE = 50;
const CARBON_SRCSRC_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/';
const CARBON_SRCSRC_SEARCH_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/search';

export interface ClipsPhotosServiceSearchParams {
  url?: string;
  q?: string;
  limit?: number;
  order?: string;
}

export interface ClipsPhotosServiceListParams {
  url?: string;
  q?: string;
  limit?: number;
  order?: string;
  categories?: string[];
  tags?: string[];
  colors?: string[];
}

@Injectable()
export class ClipsPhotosService {
  private nextListUrl: string = CARBON_SRCSRC_ENDPOINT;
  private nextSearchUrl: string = CARBON_SRCSRC_SEARCH_ENDPOINT;

  constructor(private http: Http) { }
  public search(params: ClipsPhotosServiceSearchParams = {}) {
    return this.http.get(params.url || CARBON_SRCSRC_SEARCH_ENDPOINT, {
      params: {
        q: params.q || undefined,
        order: '-source_created_at',
        limit: PER_PAGE,
      }
    }).map((res) => {
      const response = res.json();
      this.nextSearchUrl = response.next_url || null;
      return response.result.map((item) => new Photo(item));
    });
  }

  public nextSearch() {
    if (this.nextSearchUrl === undefined) {
      this.nextSearchUrl = CARBON_SRCSRC_SEARCH_ENDPOINT;
    } else if (!this.nextSearchUrl) {
      return Observable.empty<Response>();
    }
    return this.search({
      url: this.nextSearchUrl
    });
  }

  public list(params: ClipsPhotosServiceListParams = {}) {
    return this.http.get(params.url || CARBON_SRCSRC_ENDPOINT, {
      params: {
        order: '-source_created_at',
        limit: PER_PAGE,
        // 'categories': [],
        // 'colors': [],
        // 'tags': [],
      },
    }).map((res) => {
      const response = res.json();
      this.nextListUrl = response.next_url;
      return response.result.map((item) => new Photo(item));
    });
  }

  public nextList() {
    if (!this.nextListUrl) {
      this.nextListUrl = CARBON_SRCSRC_ENDPOINT;
    }
    return this.list({
      url: this.nextListUrl,
    });
  }
}
