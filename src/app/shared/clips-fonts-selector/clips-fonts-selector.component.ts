import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsFontsService } from "./clips-fonts.service";
import { ClipsSelectorComponent } from "../clips-selector/clips-selector.component";

@Component({
  selector: 'clips-fonts-selector',
  styleUrls: ['clips-fonts-selector.component.css'],
  templateUrl: 'clips-fonts-selector.component.html'
})
export class ClipsFontsSelectorComponent implements OnInit {
  @ViewChild(ClipsSelectorComponent) selector;
  @Output() change = new EventEmitter<any>()
  handleChange(event) {
    this.change.next({
      font: event.item,
    });
  }

  loadedFonts:Object = {};
  fonts:Object[] = [];
  constructor(private fontsService:ClipsFontsService) { }

  ngOnInit() {
    this.fontsService.onFontLoad(data => {
      if (!this.loadedFonts[data.font]) {
        this.fonts.push(data.font);
        this.loadedFonts[data.font] = true;

        if (this.fonts.length < 2) {
          this.selector.select(this.fonts[0]);
        }
      }
    });
    this.fontsService.loadConfig('ar-fonts.json');
  }

  public random() {
    this.selector.random();
  }

}