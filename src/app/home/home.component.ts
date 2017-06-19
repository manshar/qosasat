import { Subject } from 'rxjs/Subject';
import {
  Component,
  OnInit
} from '@angular/core';

import { Title } from './title';
import { XLargeDirective } from './x-large';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute } from '@angular/router';


const PER_PAGE = 20;
const CARBON_SRCSRC_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/';
const CARBON_SRCSRC_SEARCH_ENDPOINT = 'https://srcsrc.carbon.tools/api/v1/photo/search';

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

  searchTerm:string = '';
  search$:Subject<string> = new Subject<string>();
  filterTags_:string[] = [];
  loading_:boolean = false;
  embedded:boolean = false;
  embeddedOrigin:string = '';

  /**
   * TypeScript public modifiers
   */
  constructor(
    public title: Title,
    public http: Http,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(
      params => {
        this.embedded = params['embedded'] == '1';
        this.embeddedOrigin = params['embeddedOrigin'];
      });

    this.search$
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => {
        // this.filterTags_ = term.trim().length > 0 ? term.split(/[،,\s]/i) : [];
        // this.listPhotos();
        if (this.getQuery_().trim().length < 1) {
          this.listPhotos();
        } else {
          this.search();
        }
      });
  }

  getQuery_() {
    const categories = this.getSelectedCategories();
    const colors = this.getSelectedColors();
    const catStr = categories.length > 0 ? categories.join(' ') : '';
    const colorStr = colors.length > 0 ? colors.join(' ') : '';
    return this.searchTerm + catStr + colorStr;
  }

  search() {
    this.loading_ = true;
    this.http.get(CARBON_SRCSRC_SEARCH_ENDPOINT, {
      params: {
        'q': this.getQuery_(),
      }
    }).map(res => res.json())
      .subscribe(response => {
        console.log(response.result);
        this.photos = response.result;
        this.next_url = response.next_url;
        this.loading_ = false;
      });
  }

  listPhotos() {
    this.loading_ = true;
    const categories = this.getSelectedCategories();
    const colors = this.getSelectedColors();
    this.http.get(CARBON_SRCSRC_ENDPOINT, {
      params: {
        'order': '-source_created_at',
        'limit': PER_PAGE,
        'categories': categories.length > 0 ? categories.join(',') : undefined,
        'colors': colors.length > 0 ? colors.join(',') : undefined,
        'tags': this.filterTags_.length > 0 ? this.filterTags_.join(',') : undefined,
      },
    }).map(res => res.json())
      .subscribe(response => {
        console.log(response.result);
        this.photos = response.result;
        this.next_url = response.next_url;
        this.loading_ = false;
      });
  }

  public ngOnInit() {
    this.listPhotos();
  }

  public onScroll() {
    if (!this.next_url) {
      return;
    }
    this.loading_ = true;
    console.log('scroll');
    this.http.get(this.next_url).map(res => res.json())
      .subscribe(response => {
        this.photos = this.photos.concat(response.result);
        this.next_url = response.next_url;
        this.loading_ = false;
      });
  }

  public filtersUpdated() {
    this.next_url = null;
    // this.listPhotos();
    this.search();
  }

  handleUploadPhoto(data) {
    console.log('uploaded photo', data);
    this.router.navigateByUrl('/select-font?url=' + data.result['image_url'] + '&embedded=' + (this.embedded ? 1 : 0) + '&embeddedOrigin=' + this.embeddedOrigin);
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
