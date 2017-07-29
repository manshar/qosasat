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

  private loadedFonts: Object = {};
  @ViewChild(ClipsSelectorComponent) private selector;

  constructor(private fontsService: ClipsFontsService) { }

  public handleChange(event) {
    this.change.next({
      font: event.item,
    });
  }

  public whenReady() {
    return this.selector.whenReady();
  }

  public ngOnInit() {
    this.fontsService.onFontLoad((data) => {
      if (!this.loadedFonts[data.font]) {
        this.fonts.push(data.font);
        this.loadedFonts[data.font] = true;
      }
    });
    this.fontsService.loadConfig('ar-fonts.json');
  }

  public random() {
    this.selector.random();
  }
}
