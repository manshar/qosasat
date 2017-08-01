import { Component, OnInit, AfterContentInit, ViewChildren, ContentChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ClipsTabComponent } from "./clips-tab.component";

@Component({
  selector: 'clips-tabs',
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    .tabs-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .clips-tabs-labels {
      display: flex;
      height: 44px;
    }

    .tab-label {
      padding: 6px 12px;
      text-align: center;
      cursor: pointer;
    }

    .tab-label {
      border-bottom: none;
    }

    .tab-label.active {
      border-bottom: 3px solid #33848e;
    }

    @media (min-width: 500px) {
      .clips-tabs-labels {
        height: 50px;
      }
      .tab-label {
        padding: 12px;
      }

    }
  `],
  template: `
    <div class="tabs-wrapper">
      <div class="clips-tabs-labels">
        <div class="tab-label" *ngFor="let tab of tabs"
            tabindex="0" role="link"
            [class.active]="tab.active"
            (click)="handleClick(tab)"
            (keypress)="handleKeypress($event, tab)"
            [style.width]="(100/tabs.length) + '%'">
          {{tab.title}}
        </div>
      </div>
      <div class="tabs-content-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ClipsTabsComponent implements AfterContentInit {
  @ContentChildren(ClipsTabComponent) public tabs: QueryList<ClipsTabComponent>;
  @Output('tabselected') public tabselected: EventEmitter<any> = new EventEmitter<any>();
  @Output('tabclicked') public tabclicked: EventEmitter<any> = new EventEmitter<any>();

  public handleKeypress(event, tab) {
    switch (event.keyCode) {
      case 13: // enter
        this.select(tab);
        this.tabclicked.emit(tab);
        break;
      default:
        break;
    }
  }

  public handleClick(tab) {
    this.select(tab);
    this.tabclicked.emit(tab);
  }

  public select(selectedTab: ClipsTabComponent) {
    this.tabs.forEach(tab => {
      tab.active = false;
    });
    selectedTab.active = true;

    this.tabselected.emit(selectedTab);
  }

  public ngAfterContentInit(): void {
    this.select(this.tabs.first);
  }

}