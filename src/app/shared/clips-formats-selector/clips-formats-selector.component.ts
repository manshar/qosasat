import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsFormatsService } from './clips-formats.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';

@Component({
  selector: 'clips-formats-selector',
  styleUrls: ['clips-formats-selector.component.css'],
  templateUrl: 'clips-formats-selector.component.html'
})
export class ClipsFormatsSelectorComponent implements OnInit {
  public formats: Object = {};
  @Output() public change = new EventEmitter<any>()

  @ViewChild('textFillSelector') private textFillSelector;
  @ViewChild('textFitSelector') private textFitSelector;
  @ViewChild('textPosSelector') private textPosSelector;

  constructor(private formatsService: ClipsFormatsService) { }

  public whenReady() {
    return Promise.all([
      this.textFillSelector.whenReady(),
      this.textFitSelector.whenReady(),
      this.textPosSelector.whenReady(),
    ]);
  }

  public ngOnInit() {
    this.formats = this.formatsService.getAvailableFormats();
    this.textFillSelector.ready();
    this.textFitSelector.ready();
    this.textPosSelector.ready();
    this.textFillSelector.select(this.formats['textFillChoices'][0]);
    this.textFitSelector.select(this.formats['textFitChoices'][0]);
    this.textPosSelector.select(this.formats['textPosChoices'][4]);
  }

  public selectFill(index) {
    this.textFillSelector.select(this.formats['textFillChoices'][index]);
  }

  public random() {
    this.textFillSelector.random();
    this.textFitSelector.random();
    this.textPosSelector.random();
  }

  public handleChange(event) {
    this.change.next({
      format: event.item,
    });
  }
}