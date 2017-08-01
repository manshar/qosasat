import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsSizesService } from './clips-sizes.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';

@Component({
  selector: 'clips-sizes-selector',
  styleUrls: ['clips-sizes-selector.component.css'],
  templateUrl: 'clips-sizes-selector.component.html'
})
export class ClipsSizesSelectorComponent implements OnInit {
  public sizes: Object = {};
  @Output() public change = new EventEmitter<any>()

  @ViewChild(ClipsSelectorComponent) private selector;
  constructor(private sizesService: ClipsSizesService) { }

  public whenReady() {
    return this.selector.whenReady();
  }

  public handleChange(event) {
    this.change.next({
      size: event.item,
    });
  }

  public ngOnInit() {
    this.sizes = this.sizesService.getAvailableSizes();
    this.selector.ready();
  }

  public select(index) {
    this.selector.select(this.sizes[index]);
  }

  public random() {
    this.selector.random();
  }

}