import { Component, OnInit, Output, EventEmitter, Input, ContentChild, TemplateRef } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  selector: 'clips-selector',
  styleUrls: ['clips-selector.component.css'],
  templateUrl: 'clips-selector.component.html',
})
export class ClipsSelectorComponent implements OnInit {
  @Input() items:any[] = [];
  @Output() change = new EventEmitter<any>();
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  selectedItem:Object;
  focusedItem:Object;
  constructor() { }

  public random() {
    const index = Math.floor(Math.random() * this.items.length);
    this.select(this.items[index]);
  }

  select(item) {
    if (item !== this.selectedItem) {
      this.selectedItem = item;
      this.change.emit({
        item: item,
      });
    }
  }

  ngOnInit() {
  }

  handleFocusItem(item) {
    this.focusedItem = item;
  }

  handleBlurItem() {
    this.focusedItem = null;
  }

  handleKeyup(event) {
    let selectedIndex = 0;
    switch(event.keyCode) {
      case 13: // enter.
        if (this.focusedItem) {
          this.select(this.focusedItem);
        }
        break
      case 39: // right.
      case 38: // up.
        selectedIndex = this.items.indexOf(this.selectedItem);
        this.select(this.items[Math.max(selectedIndex - 1, 0)]);
        break;
      case 37: // left.
      case 40: // down.
        selectedIndex = this.items.indexOf(this.selectedItem);
        this.select(this.items[Math.min(selectedIndex + 1, this.items.length - 1)]);
        break;
    }
  }
}