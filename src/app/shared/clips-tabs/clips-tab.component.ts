import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'clips-tab',
  styles: [`
    .tab-content {
      overflow-y: scroll;
      position: absolute;
      height: 100vh;
      box-sizing: border-box;
      padding-bottom: 40vh;
      width: 100%;
    }
    @media (min-width: 500px) {
      .tab-content {
        padding-bottom: 10vh;
      }
    }
  `],
  template: `
    <div class="tab-content" [hidden]="!active" #scrollContainer
        infiniteScroll
        [scrollWindow]="false"
        [infiniteScrollContainer]="scrollContainer"
        [infiniteScrollDistance]="3"
        [infiniteScrollThrottle]="100"
        (scrolled)="onScroll()">
      <ng-content></ng-content>
    </div>
  `,
})
export class ClipsTabComponent implements OnInit {
  @Input('title') title:string;
  @Output('scrolled') scrolled = new EventEmitter();

  active:boolean = false;

  ngOnInit() {

  }

  onScroll() {
    this.scrolled.emit({});
  }

}