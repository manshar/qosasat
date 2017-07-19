import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import FileSaver from 'file-saver';
import { ClipComponent } from "../clip/clip.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'clips-direct-exporter',
  styleUrls: ['clips-direct-exporter.component.css'],
  templateUrl: 'clips-direct-exporter.component.html',
})

export class ClipsDirectExporterComponent implements OnInit {
  @ViewChild('previewEl') previewEl;
  @ViewChild(ClipComponent) clip;

  config: any = {
    photo: 'https://images.unsplash.com/photo-1500161727381-144726b3a965',
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


  constructor(private renderer:Renderer,
              private route:ActivatedRoute) { }

  download(clip) {
    // TODO(mk): Need to figure out a way to render in different sizes.
    // TODO(mk): Need to figure out a way to avoid re-downloading all fonts and only
    // requesting needed stuff.
    // These two could possibly be solved by having a separate route like
    // /raw-export#{config: ''} that can be embedded in an iframe and
    // executes the export inside of itself.
    // That iframe could either make the download there or just postMessage
    // to app the output blob.
    const timestamp = new Date().getTime();
    clip.export().then(blob => {
      FileSaver.saveAs(blob, timestamp + '.png');
    });
  }

  ngOnInit() {
    // Parse URL config.
    this.route.queryParams.subscribe(
        params => {
          this.config = JSON.parse(decodeURIComponent(params['config']));

          const styleRules = `
          @font-face {
            font-family: '${this.config.font}';
            font-weight: normal;
            font-style: normal;
            src: url('https://fonts.carbon.tools/${this.config.font}.eot#iefix');
            src: url('https://fonts.carbon.tools/${this.config.font}.eot#iefix') format('embedded-opentype'),
                url('https://fonts.carbon.tools/${this.config.font}.woff2') format('woff2'),
                url('https://fonts.carbon.tools/${this.config.font}.woff') format('woff'),
                url('https://fonts.carbon.tools/${this.config.font}.ttf') format('truetype');
          }`;

          var styleEl = document.createElement('style');
          styleEl.innerHTML = styleRules;

          document.body.appendChild(styleEl);

          this.download(this.clip);
        });
  }

  parseConfig_(configParam) {
  }


}