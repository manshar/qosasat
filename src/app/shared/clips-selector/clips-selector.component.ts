import {
  Component,
  Output,
  EventEmitter,
  Input,
  ContentChild,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  selector: 'clips-selector',
  styleUrls: ['clips-selector.component.css'],
  templateUrl: 'clips-selector.component.html',
})
export class ClipsSelectorComponent implements OnChanges {
  @Input() public items: any[] = [];
  @Input() public enableRandomButton: boolean = true;

  @Output() public change = new EventEmitter<any>();
  @ContentChild(TemplateRef) public template: TemplateRef<any>;

  public readyPromise: Promise<any>;
  private selectedItem: Object;
  private focusedItem: Object;
  private _readyRejector: (reason?: any) => void;
  private _readyResolver: (value?: {} | PromiseLike<{}>) => void;

  public ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes && changes['items'].currentValue) {
      setTimeout(() => {
        if (this.readyPromise) {
          this.ready();
        } else {
          this.readyPromise = Promise.resolve();
        }
      }, 10);
    }
  }

  public random() {
    const index = Math.floor(Math.random() * this.items.length);
    this.select(this.items[index]);
  }

  public select(item) {
    if (item !== this.selectedItem) {
      this.selectedItem = item;
      this.change.emit({ item });
    }
  }

  public whenReady() {
    if (this.readyPromise) {
      return this.readyPromise;
    }
    return this.readyPromise = new Promise((resolve, reject) => {
      this._readyResolver = resolve;
      this._readyRejector = reject;
    });
  }

  public ready() {
    this._readyResolver();
  }

  public error() {
    this._readyRejector();
  }

  public handleFocusItem(item) {
    this.focusedItem = item;
  }

  public handleBlurItem() {
    this.focusedItem = null;
  }

  public handleKeyup(event) {
    let selectedIndex = 0;
    switch (event.keyCode) {
      case 13: // enter.
        if (this.focusedItem && this.focusedItem !== 'random') {
          this.select(this.focusedItem);
        } else if (this.focusedItem === 'random') {
          this.random();
        }
        break;
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
      default:
        break;
    }
  }
}