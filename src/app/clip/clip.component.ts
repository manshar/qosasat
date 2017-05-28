import {
  Component,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';

import domtoimage from 'dom-to-image';

@Component({
  selector: 'clip',
  template: `

    <div class="clip-preview-card" #clip
        [ngStyle]="{'width': _preview ? '100%' : config.width + 'px'}"
        [class.visible]="loaded">
      <img class="preview-img"
        *ngIf="_preview"
        crossorigin
        [src]="getResizeUrl(photo)"
        [ngStyle]="{'max-width': config.width * previewRatio + 'px'}"
        (load)="onLoad()">
      <img *ngIf="!_preview"
        crossorigin
        [src]="getResizeUrl(photo)"
        [width]="config.width" [height]="config.height">

      <div class="bg-drop"></div>
      <div class="text-wrapper {{_textFill}} {{_textPos}}">
        <fit-text #textContainer class="text" [fitHeight]="true" [fitWidth]="true" [style.color]="'#' + textColor" [fitWidthRatio]="_fillRatio" [fitHeightRatio]="_fillRatio">
          <div [ngStyle]="{'font-family': font}" *ngIf="_lines">
            <fit-text class="line"
              *ngFor="let line of _lines" [fitHeight]="false" [fitWidth]="_fitLineWidth">
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
    // white-space: nowrap;
  }

  .clip-preview-card.visible {
    display: block;
  }

  @media (max-width: 500px) {
    .preview-img {
      width: 100%;
    }
  }

  `],
})
export class ClipComponent {
  private _lines:string[];
  private _preview:boolean = true;
  private _textFill:string = 'p90';
  private _fillRatio:number = 0.9;
  private _textPos:string = 'mc';
  private _fitLineWidth:boolean = true;

  @ViewChild('clip') clip;
  @ViewChild('textContainer') textContainer;

  @Input()
  set preview(isPreview:boolean) {
    this._preview = isPreview;
    if (this.loaded) {
      setTimeout(() => {
        console.log('preview changed, refitting');
        this.textContainer.fit(true);
      }, 1);
    }
  }
  @Input() previewRatio;
  @Input() config;
  @Input() text;
  @Input() textColor = 'ffffff';
  @Input() fontSize = '2em';
  @Input()
  set textFill(textFill:string) {
    this._textFill = textFill;
    this._fillRatio = parseInt(textFill.substring(1), 10) / 100.0;
    if (this.loaded) {
      setTimeout(() => {
        console.log('text fill changed, refitting...')
        this.textContainer.fit(true);
      }, 1);
    }
  }

  @Input()
  set textFit(textFit:string) {
    this._fitLineWidth = textFit === 'fit';
    if (this.loaded) {
      setTimeout(() => {
        console.log('text fit changed, refitting...')
        this.textContainer.fit(true);
      }, 1);
    }
  }

  @Input()
  set textPos(textPos:string) {
    this._textPos = textPos;
    if (this.loaded) {
      setTimeout(() => {
        console.log('text fit changed, refitting...')
        this.textContainer.fit(true);
      }, 1);
    }
  }

  @Input()
  set lines(lines:string[]) {
    this._lines = lines || [];
    setTimeout(() => {
      if (this.loaded) {
        this.textContainer.fit(true);
      }
    }, 100);
  }

  @Input() photo;
  @Input() font;

  loaded = false;
  getResizeUrl(photo) {
    if (!photo) {
      return;
    }
    if (photo.indexOf('unsplash') !== -1) {
      return photo + '?w=' + this.config.width + '&h=' + this.config.height + '&fit=crop'
    } else if (photo.indexOf('lh3.googleusercontent.com') !== -1) {
      return this.googleServedImageUrl_(photo, this.config.width, this.config.height, true);
    }
  }

  googleServedImageUrlBase_(photo:string) {
    const indexOfEq = photo.indexOf('=');
    return indexOfEq === -1 ? photo : photo.substring(0, indexOfEq);
  }

  googleServedImageUrl_(photo:string, width, height, crop) {
    const parts = [this.googleServedImageUrlBase_(photo), '='];
    if (width) {
      parts.push(`w${width}-`);
    }
    if (height) {
      parts.push(`h${height}-`);
    }
    if (crop) {
      parts.push('-c');
    }
    return parts.join('');
  }

  onLoad() {
    this.loaded = true;
    this.textContainer.fit();
  }
  public export() {
    return domtoimage.toBlob(this.clip.nativeElement)
      .then((blob) => {
        return blob;
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
  }
}
