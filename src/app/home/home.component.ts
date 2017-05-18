import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLargeDirective } from './x-large';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


const PER_PAGE = 20;

const CLIENT_ID = '6fd951087812fbbd4e481bc071fc90d899244fc6fd15b352bb456e097ed1d8d1';
// const CLIENT_ID = '276797ea4589bda49451745906cefa5c0d99cff31e83525e267f588daac32a17';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [
    Title
  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: [ './home.component.css' ],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = { value: '' };
  public photos:Array<Object> = [];
  page = 2;

  headers = new Headers();

  /**
   * TypeScript public modifiers
   */
  constructor(
    public appState: AppState,
    public title: Title,
    public http: Http,
  ) { }

  public ngOnInit() {
    console.log('hello `Home` component');

    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', `Client-ID ${CLIENT_ID}`);
    this.headers.append('Accept-Version', 'v1');


    this.http.get('https://api.unsplash.com/photos', {
      params: {
        'order_by': 'latest',
        'per_page': PER_PAGE,
        page: this.page++,
      },
      headers: this.headers,
    }).map(res => res.json())
      .subscribe(photos => {
        console.log(photos);
        this.photos = photos;
      });
  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
  public onScroll() {
    console.log('scroll');

    this.http.get('https://api.unsplash.com/photos', {
      params: {
        'order_by': 'latest',
        'per_page': PER_PAGE,
        page: this.page++,
      },
      headers: this.headers,
    }).map(res => res.json())
      .subscribe(photos => {
        console.log(photos);
        this.photos = this.photos.concat(photos);
      });

  }
}
