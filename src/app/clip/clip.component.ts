import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

import { Photo } from '../shared/clips-photos-selector/clips-photo.model';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'clip',
  template: `
    <div class="clip-preview-card" #clip
        [ngStyle]="{'width': preview ? '100%' : config.width + 'px'}"
        [class.visible]="loaded">

      <img class="preview-img"
        *ngIf="preview"
        crossorigin
        [src]="_photoSrc"
        (load)="onLoad()"
        (error)="onError()" />

      <img *ngIf="!preview"
        crossorigin
        [src]="_photoSrc"
        [width]="config.width" [height]="config.height"
        (load)="onLoad()"
        (error)="onError()" />

      <div class="loading-overlay" [hidden]="!loading">
        <div class="loading-pulse loading-indicator"></div>
      </div>
      <div class="bg-drop"></div>
      <div class="text-wrapper {{_textFill}} {{textPos}}" [hidden]="!textVisible">
        <fit-text #textContainer class="text"
          [fitHeight]="true"
          [fitWidth]="true"
          [style.color]="'#' + textColor"
          [fitWidthRatio]="_fillRatio"
          [fitHeightRatio]="_fillRatio">
          <div *ngIf="lines">
            <fit-text class="line"
              [font]="font"
              *ngFor="let line of lines" [fitHeight]="false" [fitWidth]="_fitLineWidth">
              {{line}}
            </fit-text>
          </div>
        </fit-text>
      </div>
    </div>
`,
  styles: [`
  .clip-preview-card {
    display: none;
  }

  .loading-overlay[hidden] {
    display: none;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    right: 0;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading-overlay .loading-indicator {
    transform: scale(3);
  }

  .text-wrapper[hidden] {
    display: none;
  }

  .text-wrapper {
    display: block;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .text-wrapper.mc {
    margin: 0 auto;
  }

  .text-wrapper.tc,
  .text-wrapper.bc {
    margin: 16px auto;
  }

  .text-wrapper.ml {
    margin: auto auto auto 16px;
  }
  .text-wrapper.tl,
  .text-wrapper.bl {
    margin: 16px auto 16px 16px;
  }

  .text-wrapper.mr {
    margin: auto 16px auto auto;
  }

  .text-wrapper.tr,
  .text-wrapper.br {
    margin: 16px 16px 16px auto;
  }

  .text-wrapper.tl fit-text,
  .text-wrapper.tc fit-text,
  .text-wrapper.tr fit-text {
    justify-content: flex-start;
  }

  .text-wrapper.bl fit-text,
  .text-wrapper.bc fit-text,
  .text-wrapper.br fit-text {
    justify-content: flex-end;
  }

  .text-wrapper.ml fit-text,
  .text-wrapper.mc fit-text,
  .text-wrapper.mr fit-text {
    justify-content: center;
  }

  .text-wrapper.tl fit-text,
  .text-wrapper.bl fit-text,
  .text-wrapper.ml fit-text {
    align-items: flex-end;
  }

  .text-wrapper.tr fit-text,
  .text-wrapper.br fit-text,
  .text-wrapper.mr fit-text {
    align-items: flex-start;
  }

  .text-wrapper.tc fit-text,
  .text-wrapper.bc fit-text,
  .text-wrapper.mc fit-text {
    align-items: center;
  }

  .bg-drop {
    position: absolute;
    top: 0; bottom: 0;
    right: 0; left: 0;
    background: rgba(0,0,0,.2);
  }

  .text {
    width: 100%;
    flex-direction: column;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    direction: rtl;
  }

  .text .line {
    display: block;
    width: 100%;
    /* white-space: nowrap; */
  }

  .clip-preview-card.visible {
    display: block;
  }

  .preview-img {
    max-height: 60vh;
    max-width: 100vw;
  }

  @media (min-width: 500px) {
    .preview-img {
      max-width: 70vw;
      max-height: 100vh;
    }
  }

  /*


  // .text-wrapper.p90.mc {
  //   transform: translateY(-50%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.mc {
  //   transform: translateY(-50%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.tc {
  //   transform: translateY(-80%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.bc {
  //   transform: translateY(-20%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.tl {
  //   transform: translateY(-80%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.ml {
  //   transform: translateY(-50%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.bl {
  //   transform: translateY(-20%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.tr {
  //   transform: translateY(-80%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.mr {
  //   transform: translateY(-50%) translateX(50%) scale(.9);
  // }

  // .text-wrapper.p90.br {
  //   transform: translateY(-20%) translateX(50%) scale(.9);
  // }



  // .text-wrapper.p75.mc {
  //   transform: translateY(-50%) translateX(50%) scale(.75);
  // }

  // .text-wrapper.p75.mc {
  //   transform: translateY(-50%) translateX(50%) scale(.75);
  // }

  // .text-wrapper.p75.tc {
  //   transform: translateY(-82%) translateX(50%) scale(.75);
  // }

  // .text-wrapper.p75.bc {
  //   transform: translateY(-18%) translateX(50%) scale(.75);
  // }

  // .text-wrapper.p75.tl {
  //   transform: translateY(-82%) translateX(40%) scale(.75);
  // }

  // .text-wrapper.p75.ml {
  //   transform: translateY(-50%) translateX(40%) scale(.75);
  // }

  // .text-wrapper.p75.bl {
  //   transform: translateY(-18%) translateX(40%) scale(.75);
  // }

  // .text-wrapper.p75.tr {
  //   transform: translateY(-82%) translateX(60%) scale(.75);
  // }

  // .text-wrapper.p75.mr {
  //   transform: translateY(-50%) translateX(60%) scale(.75);
  // }

  // .text-wrapper.p75.br {
  //   transform: translateY(-18%) translateX(60%) scale(.75);
  // }



  // .text-wrapper.p50.mc {
  //   transform: translateY(-50%) translateX(50%) scale(.50);
  // }

  // .text-wrapper.p50.tc {
  //   transform: translateY(-85%) translateX(50%) scale(.50);
  // }

  // .text-wrapper.p50.bc {
  //   transform: translateY(-15%) translateX(50%) scale(.50);
  // }

  // .text-wrapper.p50.tl {
  //   transform: translateY(-85%) translateX(30%) scale(.50);
  // }

  // .text-wrapper.p50.ml {
  //   transform: translateY(-50%) translateX(30%) scale(.50);
  // }

  // .text-wrapper.p50.bl {
  //   transform: translateY(-15%) translateX(30%) scale(.50);
  // }

  // .text-wrapper.p50.tr {
  //   transform: translateY(-85%) translateX(70%) scale(.50);
  // }

  // .text-wrapper.p50.mr {
  //   transform: translateY(-50%) translateX(70%) scale(.50);
  // }

  // .text-wrapper.p50.br {
  //   transform: translateY(-15%) translateX(70%) scale(.50);
  // }

  // TODO(mk): Move this to outside component.
  // .preview-img {
  //   width: 100%;
  // }

  // @media (max-width: 850px) {
  //   .preview-img {
  //     width: 100%;
  //   }
  // }
  */
  `],
})
export class ClipComponent implements OnChanges {
  private _textFill: string = 'p90';
  private _fillRatio: number = 0.9;
  private _fitLineWidth: boolean = true;
  private _photoSrc: string;
  private _noConfigChange: boolean = true;
  private loading: boolean = true;

  @ViewChild('clip') private clip;
  @ViewChild('textContainer') private textContainer;

  @Input() private textVisible: boolean = true;
  @Input() private preview: boolean;
  @Input() private previewRatio: number;
  @Input() private config: any;
  @Input() private text: string;
  @Input() private textColor: string = 'ffffff';
  @Input() private fontSize: string = '2em';
  @Input()
  set textFill(textFill: string) {
    this._textFill = textFill;
    this._fillRatio = parseInt(textFill.substring(1), 10) / 100.0;
  }

  @Input()
  set textFit(textFit: string) {
    this._fitLineWidth = textFit === 'fit';
  }

  @Input() private textPos: string;
  @Input() private lines: string[];
  @Input() private photo: Photo;
  @Input() private font: string;

  @Output() private imageFailed = new EventEmitter<any>();

  private _loadPromise: Promise<any>;
  private _loadPromiseResolver: Function;
  private loaded: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
    const refitOnChangeProps = ['font', 'config', 'lines', 'textFill', 'textFit'];
    const shouldRefit = refitOnChangeProps.some((prop) => prop in changes);
    if ('photo' in changes || 'config' in changes) {
      this._photoSrc = this.getResizeUrl(this.photo);
      this.loading = true;
      this.loaded = false;
      this._loadPromise = null;
      this._noConfigChange = !shouldRefit;
      return;
    } else {
      if (shouldRefit && this.loaded) {
        const timeout = 'lines' in changes ? 50 : 1;
        setTimeout(() => this.textContainer.fit(true), timeout);
      }
    }
  }

  public export(waitTime = 10) {
    return this.whenLoaded().then(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), waitTime);
      }).then(() => {
        return domtoimage.toBlob(this.clip.nativeElement)
          .then((blob) => {
            return blob;
          })
          .catch((error) => {
              console.error('oops, something went wrong!', error);
          });
        });
      });
  }

  private getResizeUrl(photo): string {
    if (!photo) {
      return;
    }
    return photo.getSrc(this.config.width, this.config.height, true);
  }

  private onError(event) {
    this.imageFailed.emit({event});
  }

  private onLoad() {
    this.loaded = true;
    const promise = this._noConfigChange
        ? Promise.resolve() : this.textContainer.fit(true);
    promise.then(() => {
      setTimeout(() => {
        this._noConfigChange = true;
        if (this._loadPromiseResolver) {
          this._loadPromiseResolver();
        } else {
          this._loadPromise = Promise.resolve();
        }
        this.loading = false;
      }, 200);
    });
  }

  private whenLoaded() {
    if (this._loadPromise) {
      return this._loadPromise;
    }
    return this._loadPromise = new Promise((resolve) => {
      this._loadPromiseResolver = resolve;
    });
  }
}
