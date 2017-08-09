import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsFontsService } from './clips-fonts.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';

@Component({
  selector: 'clips-fonts-selector',
  styleUrls: ['clips-fonts-selector.component.css'],
  templateUrl: 'clips-fonts-selector.component.html'
})
export class ClipsFontsSelectorComponent implements OnInit {
  public fonts: Object[] = [];
  @Output() public change = new EventEmitter<any>()

  private _resolveEnoughFontsLoaded: (value?: {} | PromiseLike<{}>) => void;
  private _enoughFontsLoadedPromise: Promise<{}>;
  private loadedFonts: Object = {};
  @ViewChild(ClipsSelectorComponent) private selector;

  constructor(private fontsService: ClipsFontsService) {
    this._enoughFontsLoadedPromise = new Promise((resolve) => {
      this._resolveEnoughFontsLoaded = resolve;
    });
  }

  public handleChange(event) {
    this.change.next({
      font: event.item,
    });
  }

  public whenReady() {
    return Promise.all([
      this.selector.whenReady(),
      this._enoughFontsLoadedPromise,
    ]);
  }

  public ngOnInit() {
    this.fontsService.onFontLoad((data) => {
      if (!this.loadedFonts[data.font]) {
        this.fonts.push(data.font);
        this.loadedFonts[data.font] = true;
      }
      if (this.fonts.length > 5 && this._resolveEnoughFontsLoaded) {
        this._resolveEnoughFontsLoaded();
        this._resolveEnoughFontsLoaded = null;
      }
    });
    this.fontsService.loadConfig('ar-fonts.json');
  }

  public random() {
    this.selector.random();
  }
}
