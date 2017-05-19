import {
  Component,
  OnInit
} from '@angular/core';

import { Title } from './title';
import { XLargeDirective } from './x-large';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';


const PER_PAGE = 20;
const CARBON_SRCSRC_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/';

function generateWebsafeColors() {
  let colors = [];
  for (let r = 0; r < 16; r += 3) {
    for (let g = 0; g < 16; g += 3) {
      for (let b = 0; b < 16; b += 3) {
        colors.push(r.toString(16) + r.toString(16) + g.toString(16) + g.toString(16) + b.toString(16) + b.toString(16));
      }
    }
  }
  return colors;
}

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
  public photos:Array<Object> = [{
    source_photographer_name: 'Loading...',
    source_name: 'Loading...',
  }, {
    source_photographer_name: 'Loading...',
    source_name: 'Loading...',
  }, {
    source_photographer_name: 'Loading...',
    source_name: 'Loading...',
  }, {
    source_photographer_name: 'Loading...',
    source_name: 'Loading...',
  }, {
    source_photographer_name: 'Loading...',
    source_name: 'Loading...',
  }, {
    source_photographer_name: 'Loading...',
    source_name: 'Loading...',
  },];
  colors:string[];
  availableColors:string[] = generateWebsafeColors();
  next_url:string;

  categoriesList = ['Nature', 'Buildings', 'People', 'Object', 'Food & Drink', 'Technology'];

  categories = {
    values: ['Nature', 'Buildings', 'People', 'Objects', 'Food & Drink', 'Technology'],
    labels: ['طبيعة', 'بنايات', 'أشخاص', 'أشياء', 'طعام وشراب', 'تكنولوجيا'],
    filters: {
      'Nature': false,
      'Buildings': false,
      'People': false,
      'Objects': false,
      'Food & Drink': false,
      'Technology': false,
    },
  };
  /**
   * TypeScript public modifiers
   */
  constructor(
    public title: Title,
    public http: Http,
    public router: Router,
  ) { }

  listPhotos() {
    this.http.get(CARBON_SRCSRC_ENDPOINT, {
      params: {
        'order': '-source_created_at',
        'limit': PER_PAGE,
        'categories': this.getSelectedCategories(),
        'colors': this.getSelectedColors(),
      },
    }).map(res => res.json())
      .subscribe(response => {
        console.log(response.result);
        this.photos = response.result;
        this.next_url = response.next_url;
      });
  }

  public ngOnInit() {
    this.listPhotos();
  }

  public onScroll() {
    if (!this.next_url) {
      return;
    }
    console.log('scroll');
    this.http.get(this.next_url).map(res => res.json())
      .subscribe(response => {
        this.photos = this.photos.concat(response.result);
        this.next_url = response.next_url;
      });
  }

  public filtersUpdated() {
    this.next_url = null;
    this.listPhotos();
  }

  handleUploadPhoto(data) {
    console.log('uploaded photo', data);
    this.router.navigateByUrl('/select-font?url=' + data.result['image_url']);
  }

  filter(map) {
    if (!map) {
      return [];
    }
    var keys = Object.keys(map);
    var filtered = keys.filter(function(key) {
      return map[key];
    });
    return filtered;
  }

  public getSelectedColors() {
    return this.filter(this.colors);
  }

  public getSelectedCategories() {
    return this.filter(this.categories.filters);
  }
}
