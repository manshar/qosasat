import {
  Component,
  OnInit,
  OnDestroy,
  Renderer,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { IClipConfig } from '../../clip/clip-config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'clips-export-manager',
  styleUrls: ['clips-export-manager.component.css'],
  templateUrl: 'clips-export-manager.component.html'
})
export class ClipsExportManagerComponent implements OnInit, OnDestroy {
  @Output('exportcomplete') public exportcomplete = new EventEmitter<any>();
  public queuedCount: number = 0;

  @ViewChild('iframeContainer') private iframesContainer;
  private exportIframes = {};
  private _messageListenerUnbind: Function;
  constructor(private renderer: Renderer,
              private sanitizer: DomSanitizer) { }

  public ngOnInit() {
    this._messageListenerUnbind = this.renderer.listenGlobal(
      'window', 'message', (e: MessageEvent) => this._handleMessage(e));
  }

  public ngOnDestroy() {
    this._messageListenerUnbind();
  }

  public add(config: IClipConfig) {
    const iframe = this._createIframe(config);
    this.exportIframes[config.id] = iframe;
    this.renderer.invokeElementMethod(
      this.iframesContainer.nativeElement, 'appendChild', [iframe]);
    this.queuedCount++;
  }

  private _createIframe(config: IClipConfig) {
    const encodeConfig = encodeURIComponent(JSON.stringify(config));
    // const sanitizedSrc = this.sanitizer
    //   .bypassSecurityTrustResourceUrl(
    //       `//${document.location.host}/download?config=${encodeConfig}`);
    const iframe = this.renderer.createElement(
        this.iframesContainer.nativeElement, 'iframe');
    iframe.id = `export-iframe-${config.id}`;
    iframe.src = `//${document.location.host}/download?config=${encodeConfig}`;
    return iframe;
  }

  private _handleMessage(event: MessageEvent) {
    console.log(event);

    if (event.data && event.data.blob) {
      switch (event.data.type) {
        case 'progress':
          break;
        case 'exportcomplete':
          this.renderer.invokeElementMethod(
            this.iframesContainer.nativeElement, 'removeChild',
            [this.exportIframes[event.data.id]]);
          this.exportcomplete.emit({
            data: {
              blob: event.data.blob,
              id: event.data.id,
              config: event.data.config,
            },
          });
          delete this.exportIframes[event.data.id];
          this.queuedCount--;
          break;
        case 'exportfailed':
          break;
        default:
          break;
      }
      const timestamp = new Date().getTime();
      // FileSaver.saveAs(event.data.blob, timestamp + '.png');
      // this.downloading = false;
    }

  }

}
