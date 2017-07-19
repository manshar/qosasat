import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsFormatsService } from "./clips-formats.service";
import { ClipsSelectorComponent } from "../clips-selector/clips-selector.component";

@Component({
  selector: 'clips-formats-selector',
  styleUrls: ['clips-formats-selector.component.css'],
  templateUrl: 'clips-formats-selector.component.html'
})
export class ClipsFormatsSelectorComponent implements OnInit {
  @ViewChild('textFillSelector') textFillSelector;
  @ViewChild('textFitSelector') textFitSelector;
  @ViewChild('textPosSelector') textPosSelector;

  @Output() change = new EventEmitter<any>()
  handleChange(event) {
    this.change.next({
      format: event.item,
    });
  }

  formats:Object = {};
  constructor(private formatsService:ClipsFormatsService) { }

  ngOnInit() {
    this.formats = this.formatsService.getAvailableFormats();
    this.textFillSelector.select(this.formats['textFillChoices'][0]);
    this.textFitSelector.select(this.formats['textFitChoices'][0]);
    this.textPosSelector.select(this.formats['textPosChoices'][4]);
  }

  public random() {
    this.textFillSelector.random();
    this.textFitSelector.random();
    this.textPosSelector.random();
  }

}