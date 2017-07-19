import { Component, OnInit, AfterContentInit, ViewChildren, ContentChildren, QueryList } from '@angular/core';
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
    }

    .clips-tabs-labels {
      display: flex;
      border-bottom: 1px solid #eaeaea;
      height: 50px;
    }

    .tab-label {
      padding: 12px;
      text-align: center;
      cursor: pointer;
    }

    .tab-label {
      border-bottom: none;
    }

    .tab-label.active {
      border-bottom: 3px solid #33848e;
    }
  `],
  template: `
    <div class="tabs-wrapper">
      <div class="clips-tabs-labels">
        <div class="tab-label" *ngFor="let tab of tabs"
            tabindex="0" role="link"
            [class.active]="tab.active"
            (click)="select(tab)"
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
export class ClipsTabsComponent implements OnInit, AfterContentInit {
  @ContentChildren(ClipsTabComponent) tabs: QueryList<ClipsTabComponent>;

  constructor() { }

  handleKeypress(event, tab) {
    switch (event.keyCode) {
      case 13: // enter
        this.select(tab);
        break;
    }
  }
  select(selectedTab: ClipsTabComponent) {
    this.tabs.forEach(tab => {
      tab.active = false;
    });
    selectedTab.active = true;
  }
  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.select(this.tabs.first);
  }

}