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
    <div class="clip-preview-card" #clip [ngStyle]="{'width': preview ? '100%' : config.width + 'px'}" [class.visible]="loaded">
      <img *ngIf="preview" crossorigin [src]="getResizeUrl(photo)" [ngStyle]="{'max-width': config.width * previewRatio + 'px'}" width="100%" height="100%" (load)="onLoad()">
      <img *ngIf="!preview" crossorigin [src]="getResizeUrl(photo)" [width]="config.width" [height]="config.height">
      <div class="text" [ngStyle]="{'font-family': font}" *ngIf="text">
        <span>{{text}}</span>
      </div>
    </div>
`,
  styles: [`
  .clip-preview-card {
    display: none;
  }

  .clip-preview-card.visible {
    display: block;
  }
  `],
})
export class ClipComponent {
  @ViewChild('clip') clip;

  @Input() preview = true;
  @Input() previewRatio;
  @Input() config;
  @Input() text;
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
