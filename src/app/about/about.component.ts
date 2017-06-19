import {
  Component,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontLoader } from '../app.service';
import { ClipComponent } from '../clip/clip.component';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'about',
  styleUrls: ['./about.component.css'],
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

  @ViewChildren(ClipComponent) clips;
  allFonts = [];
  fonts = [];
  selectedPhoto = '';
  embedded:boolean = false;
  embeddedOrigin:string = '';
  text = 'مرحباً بالعالم\nما الذي يلهمكم ويجعلك تبتسم اليوم؟';
  lines:string[] = []
  page = 1;
  perPage = 9;
  text$:Subject<string> = new Subject<string>();
  loading:boolean = true;

  public localState: any;
  constructor(
    public route: ActivatedRoute,
    private fontLoader: FontLoader,
  ) {
    this.text$
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(text => this.lines = text.split('\n'));
  }

  public ngOnInit() {
    this.page = 1;
    this.lines = this.text.split('\n');
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
        this.embedded = params['embedded'] == '1';
        this.embeddedOrigin = params['embeddedOrigin'];
      });

    this.loadFonts();
  }

  private loadFonts() {
    this.allFonts = this.fontLoader.loadedFonts;
    this.fontLoader.onFontLoad(data => {
      this.allFonts.push(data.font);
      this.maybeLoadFirstPage_();
    });
    this.maybeLoadFirstPage_();
    this.fontLoader.loadConfig('ar-fonts.json');
  }

  maybeLoadFirstPage_() {
    if (this.allFonts.length > this.perPage && this.page === 1) {
      this.pageFonts();
      this.loading = false;
    } else if (this.page === 1) {
      // Just load whatever we have so far.
      this.fonts = this.allFonts.slice(0, this.page * this.perPage);
    }
  }

  pageFonts() {
    this.fonts = this.allFonts.slice(0, this.page * this.perPage);
    this.page++;
  }

  onScroll() {
    if (this.allFonts.length < this.page * this.perPage) {
      return;
    }
    this.pageFonts();
  }
}
