import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import FileSaver from 'file-saver';
import { ClipComponent } from '../clip/clip.component';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../shared/clips-photos-selector/clips-photo.model';

@Component({
  selector: 'clips-direct-exporter',
  styleUrls: ['clips-direct-exporter.component.css'],
  templateUrl: 'clips-direct-exporter.component.html',
})

export class ClipsDirectExporterComponent implements OnInit {
  @ViewChild('previewEl') private previewEl;
  @ViewChild(ClipComponent) private clip;

  private _passedConfig: any;
  private config: any = {
    id: 'export-' + new Date().getTime(),
    photo: new Photo({
      original_serve_url: 'https://images.unsplash.com/photo-1500161727381-144726b3a965',
      source_name: 'Unsplash',
    }),
    font: 'barabics',
    lines: [
      'مرحباً بالعالم',
      'ما الذي يلهمكم ويجعلكم تبتسمون اليوم؟',
    ],
    previewRatio: 1,
    textFill: 'p90',
    textPos: 'mc',
    textFit: 'fit',
    size: {width: 800, height: 800},
  };

  constructor(private renderer: Renderer,
              private route: ActivatedRoute) { }

  public download(clip) {
    const timestamp = new Date().getTime();
    clip.export(500).then((blob) => {
      const origin = `${document.location.protocol}//${document.location.host}`;
      if (this.config.download) {
        FileSaver.saveAs(blob, timestamp + '.png');
      } else {
        parent.postMessage({
           blob,
           type: 'exportcomplete',
           id: this.config.id,
           config: this._passedConfig,
        }, this.config.embeddedOrigin || origin);
      }
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
}