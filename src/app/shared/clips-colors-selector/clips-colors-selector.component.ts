import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsColorsService } from './clips-colors.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';

@Component({
  selector: 'clips-colors-selector',
  styleUrls: ['clips-colors-selector.component.css'],
  templateUrl: 'clips-colors-selector.component.html'
})
export class ClipsColorsSelectorComponent implements OnInit {
  public colors: Object[] = [];
  @Output() public change = new EventEmitter<any>();

  @ViewChild(ClipsSelectorComponent) private selector;

  constructor(private colorsService: ClipsColorsService) { }

  public handleChange(event) {
    this.change.next({
      value: event.item,
    });
  }

  public whenReady() {
    return this.selector.whenReady();
  }

  public ngOnInit() {
    this.colors = this.colorsService.getAvailableColors();
  }

  public random() {
    this.selector.random();
  }
}
