import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import FileSaver from 'file-saver';
import { ClipComponent } from '../clip/clip.component';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../shared/clips-photos-selector/clips-photo.model';
import { ClipRenderService } from '../clip/clip-render.service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'clips-direct-exporter',
  styleUrls: ['clips-direct-exporter.component.css'],
  templateUrl: 'clips-direct-exporter.component.html',
})

export class ClipsDirectExporterComponent implements OnInit {
  @ViewChild('previewEl') private previewEl;
  @ViewChild(ClipComponent) private clip;

  private _passedConfig: any;
  private config: any = {};

  constructor(private renderer: Renderer,
              private route: ActivatedRoute,
              private renderService: ClipRenderService) { }

  public download(clip) {
    clip.export(1500).then((blob) => {
      this.downloadSuccess(blob);
    }).catch((error) => {
      return this.renderOnServerWithChrome().toPromise()
        .then((blob) => {
          this.downloadSuccess(blob);
        });
    });
  }

  public renderOnServerWithChrome() {
    return this.renderService.renderWithChrome(
      document.location.href, {
        width: this.config.size.width,
        height: this.config.size.height,
      });
  }

  public ngOnInit() {
    // Parse URL config.
    this.route.queryParams.subscribe((params) => {
      this._passedConfig = JSON.parse(decodeURIComponent(params['config']));
      this.config = JSON.parse(decodeURIComponent(params['config']));
      this.config.photo = new Photo(this.config.photo);
      const styleRules = `
      @font-face {
        font-family: '${this.config.font}';
        font-weight: normal;
        font-style: normal;
        src: url('https://fonts.carbon.tools/${this.config.font}.eot#iefix');
        src: url('https://fonts.carbon.tools/${this.config.font}.eot#iefix')
              format('embedded-opentype'),
            url('https://fonts.carbon.tools/${this.config.font}.woff2') format('woff2'),
            url('https://fonts.carbon.tools/${this.config.font}.woff') format('woff'),
            url('https://fonts.carbon.tools/${this.config.font}.ttf') format('truetype');
      }`;

      const styleEl = document.createElement('style');
      styleEl.innerHTML = styleRules;
      document.body.appendChild(styleEl);

      this.download(this.clip);
    });
  }

  private downloadSuccess(blob) {
    const timestamp = new Date().getTime();
    const origin = `${document.location.protocol}//${document.location.host}`;
    if (this.config.download) {
      // console.log(blob);
      // document.open(blob, '_blank');
      // const svgString = blob.split(',')[1];
      // FileSaver.saveAs(new Blob([blob], {"type": "image/svg+xml"}), timestamp + '.svg');
      FileSaver.saveAs(blob, timestamp + '.png');
    } else {
      parent.postMessage({
          blob,
          type: 'exportcomplete',
          id: this.config.id,
          config: this._passedConfig,
      }, this.config.embeddedOrigin || origin);
    }
  }
}