import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsSizesService } from "./clips-sizes.service";
import { ClipsSelectorComponent } from "../clips-selector/clips-selector.component";

@Component({
  selector: 'clips-sizes-selector',
  styleUrls: ['clips-sizes-selector.component.css'],
  templateUrl: 'clips-sizes-selector.component.html'
})
export class ClipsSizesSelectorComponent implements OnInit {
  @ViewChild(ClipsSelectorComponent) selector;

  @Output() change = new EventEmitter<any>()
  handleChange(event) {
    this.change.next({
      size: event.item,
    });
  }

  sizes:Object = {};
  constructor(private sizesService:ClipsSizesService) { }

  ngOnInit() {
    this.sizes = this.sizesService.getAvailableSizes();
    this.selector.select(this.sizes[0]);
  }

  public random() {
    this.selector.random();
  }

}