import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewChildren,
} from '@angular/core';

import { Photo } from '../shared/clips-photos-selector/clips-photo.model';
import domtoimage from 'dom-to-image';
import { DomSanitizer } from '@angular/platform-browser';
import { FitTextComponent } from './fit-text.component';
import { ClipRenderService } from './clip-render.service';

import 'rxjs/add/operator/toPromise';

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
  @ViewChildren(FitTextComponent) private textLinesComponents;

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

  constructor(private sanitizer: DomSanitizer,
              private el: ElementRef,
              private renderService: ClipRenderService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const refitOnChangeProps = ['font', 'config', 'lines', 'textFill', 'textFit'];
    if ('config' in changes) {
      if (changes['config'].firstChange) {
        this.resizerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
          `data:image/svg+xml;utf8,<svg
            height="${this.config.height}"
            width="${this.config.width}"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"></svg>`);
      } else {
        this.resizerSrc = undefined;
        setTimeout(() => {
          this.resizerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/svg+xml;utf8,<svg
              height="${this.config.height}"
              width="${this.config.width}"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"></svg>`);
        }, 10);
      }
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
        const isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        if (isChrome && !isIOS) {
          return domtoimage.toBlob(this.clip.nativeElement)
            .then((blob) => {
              return blob;
            })
            // renderOnServer is faster than renderOnServerWithChrome - the only problem
            // is that it is inconsistent sometimes with characters spacing and
            // does not render english or emoji characters.
            // Let's just let it fallback to renderOnServerWithChrome for now.
            .catch((error) => {
              return this.renderOnServer().toPromise().then((blob) => {
                return blob;
              });
            });
          } else {
            return this.renderOnServer().toPromise().then((blob) => {
              return blob;
            });
            // throw 'Render on Server using Chrome';
          }
        });
      });
  }

  public renderOnServer() {
    const linesConfig = [];
    this.textLinesComponents.forEach((textLine, index) => {
      if (textLine === this.textContainer) {
        return;
      }

      const dimensions = textLine.getDimensionsRelativeTo(this.el.nativeElement);
      linesConfig.push({
        text: this.lines[index - 1],
        font: {
          name: dimensions.fontFamily,
          size: parseFloat(dimensions.fontSize),
          color: dimensions.color,
        },
        position: {
          x: dimensions.left,
          y: dimensions.top,
        }
      });
    });

    const serverRenderConfig = {
      uid: 'someuid',
      templateName: 'qosasa',
      output: {
        width: this.config.width,
        height: this.config.height,
      },
      background: {
        imageUrl: this.getResizeUrl(this.photo),
      },
      texts: linesConfig,
    };
    return this.renderService.render(serverRenderConfig);
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
