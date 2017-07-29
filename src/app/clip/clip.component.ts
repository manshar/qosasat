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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'clip',
  templateUrl: 'clip.component.html',
  styleUrls: ['clip.component.css'],
})
export class ClipComponent implements OnChanges {
  failedLoadingImage: boolean;
  public resizerSrc;
  @Input() public displayWidth: string;
  @Input() public displayHeight: string;
  @Input() public textVisible: boolean = true;
  @Input() public preview: boolean;
  @Input() public previewRatio: number;
  @Input() public config: any;
  @Input() public text: string;
  @Input() public textColor: string = 'ffffff';
  @Input() public fontSize: string = '2em';
  @Input() public textPos: string;
  @Input() public lines: string[];
  @Input() public photo: Photo;
  @Input() public font: string;
  @Input() public nophoto: boolean = false;

  @Output() public imageFailed = new EventEmitter<any>();

  private _textFill: string = 'p90';
  private _fillRatio: number = 0.9;
  private _fitLineWidth: boolean = true;
  private _photoSrc: string;
  private _noConfigChange: boolean = true;
  private loading: boolean = true;
  private linesChanging: boolean = false;

  @ViewChild('clip') private clip;
  @ViewChild('textContainer') private textContainer;

  @Input()
  set textFill(textFill: string) {
    this._textFill = textFill;
    this._fillRatio = parseInt(textFill.substring(1), 10) / 100.0;
  }

  @Input()
  set textFit(textFit: string) {
    this._fitLineWidth = textFit === 'fit';
  }

  private _loadPromise: Promise<any>;
  private _loadPromiseResolver: Function;
  private _loadPromiseRejector: Function;
  private loaded: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const refitOnChangeProps = ['font', 'config', 'lines', 'textFill', 'textFit'];

    if ('config' in changes) {
      this.resizerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        `data:image/svg+xml;utf8,<svg
          height="${this.config.height}"
          width="${this.config.width}"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"></svg>`);
    }
    const shouldRefit = refitOnChangeProps.some((prop) => prop in changes);
    if ('photo' in changes || 'config' in changes) {
      this._photoSrc = this.getResizeUrl(this.photo);
      this.loading = true;
      this.loaded = false;
      this._loadPromise = null;
      return;
    } else {
      if (shouldRefit) {
        const timeout = 'lines' in changes ? 50 : 1;
        this.linesChanging = true;
        setTimeout(() => this.textContainer.fit(true).then(() => {
          this.linesChanging = false;
        }), timeout);
      }
    }
  }

  public refit() {
    this.textContainer.fit(true);
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
    if (!this.photo) {
      return;
    }
    this.imageFailed.emit({event});
    this.loaded = true;
    this.failedLoadingImage = true;
    this.textContainer.fit(true);
    this.loading = false;
  }

  private onLoad() {
    this.loaded = true;
    const promise = this.textContainer.fit(true);
    this.loading = false;
    promise.then(() => {
      setTimeout(() => {
        this._noConfigChange = true;
        if (this._loadPromiseResolver) {
          this._loadPromiseResolver();
        } else {
          this._loadPromise = Promise.resolve();
        }
      }, 200);
    });
  }

  private whenLoaded() {
    if (this._loadPromise) {
      return this._loadPromise;
    }
    return this._loadPromise = new Promise((resolve, reject) => {
      this._loadPromiseResolver = resolve;
      this._loadPromiseRejector = reject;
    });
  }
}
