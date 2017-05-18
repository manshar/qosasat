import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontLoader } from '../app.service';

@Component({
  selector: 'about',
  styleUrls: ['./about.component.css'],
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  fonts = [];
  selectedPhoto = '';
  text = 'مرحباً بالعالم';

  public localState: any;
  constructor(
    public route: ActivatedRoute
  ) {}

  public ngOnInit() {
    console.log(this.route);
    this.route
      .data
      .subscribe((data: any) => {
        /**
         * Your resolved data from route.
         */
        this.localState = data.yourData;
      });

    this.route.queryParams.subscribe(
      params => {
        this.selectedPhoto = params['url'];
      });

    console.log('hello `About` component');
    /**
     * static data that is bundled
     * var mockData = require('assets/mock-data/mock-data.json');
     * console.log('mockData', mockData);
     * if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
     */
    this.loadFonts();
  }
  private loadFonts() {
    FontLoader.loadConfig('ar-fonts.json');

    this.fonts = FontLoader.loadedFonts;
  }

}
