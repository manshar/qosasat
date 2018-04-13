import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

import { YorwaEncoder } from './yorwa-encoder.service';
import { YorwaDecoder } from './yorwa-decoder.service';

const PER_PAGE = 50;
const YORWA_QUOTES_SEARCH_ENDPOINT = (
  'https://1aabf3b9-2111-44bb-8d04-5f1b9c9045f1-bluemix.cloudant.com/detayorwa2/_design/searchii/_search/ser1/');
    // 'https://yorwa.cloudant.com/detayorwa2/_design/searchii/_search/ser1/');
// ?q=light:(<query>)&sort=%22-date%22&limit=<n>

export interface YorwaQuotesServiceSearchParams {
  q?: string;
  bookmark?: string;
  limit?: number;
  sort?: string;
}


export interface YorwaQuotesServiceSearchResponse {
  total_rows?: number;
  bookmark?: string;
  rows?: YorwaQuoteRow[];
}

export interface YorwaQuoteRow {
  id?: string;
  order?: number[];
  fields?: YorwaQuoteRowFields;
}

export interface YorwaQuoteRowFields {
  quote?: string;
  light?: string;
  date?: number;
  src?: string;
}

@Injectable()
export class YorwaQuotesService {
  private nextBookmark: string = undefined;
  private nextParams: YorwaQuotesServiceSearchParams = undefined;

  constructor(private http: Http,
              private encoder: YorwaEncoder,
              private decoder: YorwaDecoder) { }

  public search(params: YorwaQuotesServiceSearchParams = {}) {
    const normalizedTerm = this.encoder.encode(params.q);
    const actualParams = {
      q: `light:(${normalizedTerm})`,
      bookmark: params.bookmark || undefined,
      limit: params.limit || PER_PAGE,
      sort: params.sort || '"-date"',
    };
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${proxyUrl}${YORWA_QUOTES_SEARCH_ENDPOINT}`;
    return this.http.get(url, {
      params: actualParams,
      // headers:
    }).map((res) => res.json())
      .map((response) => {
          this.nextBookmark = response.bookmark;
          this.nextParams = actualParams;
          this.nextParams.bookmark = response.bookmark;
          return response.rows.map((row: YorwaQuoteRow) => {
            const fields: YorwaQuoteRowFields = row.fields;
            return {
              quote: this.decoder.decode(fields.quote),
              light: this.decoder.decode(fields.light),
              src: fields.src,
              date: new Date(fields.date),
            };
          });
      });
  }

  public nextSearch() {
    return this.search(this.nextParams);
  }
}
