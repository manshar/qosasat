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
    <div class="clip-preview-card" #clip [ngStyle]="{'width': preview ? '100%' : config.width + 'px'}">
      <img *ngIf="preview" crossorigin [src]="photo + '?w=' + config.width + '&h=' + config.height + '&fit=crop'" [ngStyle]="{'max-width': config.width * previewRatio + 'px'}" width="100%" height="100%">
      <img *ngIf="!preview" crossorigin [src]="photo + '?w=' + config.width + '&h=' + config.height + '&fit=crop'" [width]="config.width" [height]="config.height">
      <div class="text" [ngStyle]="{'font-family': font}" *ngIf="text">
        <span>{{text}}</span>
      </div>
    </div>
`,
})
export class ClipComponent {
  @ViewChild('clip') clip;

  @Input() preview = true;
  @Input() previewRatio;
  @Input() config;
  @Input() text;
  @Input() photo;
  @Input() font;

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
