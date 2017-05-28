import {
  Component,
  Directive,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipComponent } from '../clip/clip.component';

import { FontLoader } from '../app.service';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { Subject } from 'rxjs/Subject';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/filter";


const BASE_HEIGHT = 500.0;

@Component({
  selector: 'export',
  styleUrls: ['./export.component.css'],
  templateUrl: './export.component.html',
})
export class ExportComponent implements OnInit, AfterViewInit {
  @ViewChild('formRef') form;
  @ViewChildren(ClipComponent) clips: QueryList<ClipComponent>;
  preview = true;
  selectedFont = '';
  selectedPhoto = '';
  text;
  lines = [];

  textFill = 'p90';
  textPos = 'mc';
  textFit = 'fit';
  availableColors = [
    'ffffff', '4f9900', '82cc33', '518020', 'c1ff80', '91bf60', '44592d', '7b8c69', '184000', 'b7d9a3', '52f23d', '324030', '79f27b', '4d664d', '1a6625', '60bf6e', '00b333', 'bfffd1', '008c3a', '004d2a', '00331c', '3df2a0', '6cd9a8', '86b39e', '208061', '2d594b', 'bfffeb', '00ffd0', '6cd9c5', '56736d', '00fff2', '008079', '00def2', '00a4b3', '003a40', 'b6edf2', '7ca2a6', '394b4d', '00a0cc', '004659', '73cde6', '396673', '0085cc', '003a59', '267199', '0d2633', '0056a6', '003566', '001a33', '79b8f2', 'bfe0ff', '869db3', '003180', '002259', '3d82f2', '46618c', '566173', '39414d', '0039e6', '0029a6', '3964e6', '99a6cc', '606bbf', '202440', '020073', 'b7b6f2', '434359', '2a1d73', '120d33', '51468c', '6e698c', '4500f2', '400099', '20004d', 'ac79f2', '7e59b3', '5d238c', '9d00e6', '7a00b3', '563366', '362040', 'ebbfff', 'b08fbf', '2a0033', '42134d', '614d66', '3d3040', 'f200ff', 'b600bf', '85008c', '621a66', 'ec79f2', '8c4686', 'ff00c8', 'b32d95', '997391', 'e60095', '400029', '80205e', 'e673bd', 'd90070', '660035', 'b35987', '66334d', '330014', 'a62959', '4c1329', '8c4661', 'ffbfd8', 'd90036', '66001a', 'ff4070', 'f27997', '331a20', '403034', 'e5001b', '7f000f', '8c232f', '401016', 'a6535d', '663339', 'cc999f', '735659',
  ];
  colors = ['ffffff'];
  textColor = 'ffffff';

  colorUpdate() {
    console.log('color update:', this.colors, this.textColor);
    this.textColor = Object.keys(this.colors)[0];
  }
  text$:Subject<string> = new Subject<string>();

  configs = [{
    group: 'facebook',
    name: 'facebook-profile-photo',
    label: 'صورة الملف الشخصي على فيسبوك',
    width: 1000,
    height: 1000,
    ratio: 100,
    previewRatio: BASE_HEIGHT/1000,
  }, {
    group: 'facebook',
    name: 'facebook-cover-photo',
    label: 'صورة الغطاء على الملف الشخصي على فيسبوك',
    width: 1640,
    height: 624,
    ratio: 624/1640 * 100,
    previewRatio: BASE_HEIGHT/624,
  }, {
    group: 'facebook',
    name: 'facebook-shared-image',
    label: 'صورة للمشاركة على فيسبوك',
    width: 1200,
    height: 630,
    ratio: 630.0/1200 * 100,
    previewRatio: BASE_HEIGHT/630,
  }, {
    group: 'facebook',
    name: 'facebook-shared-link',
    label: 'صورة عرض لمقال مشارك على فيسبوك',
    width: 1200,
    height: 627,
    ratio: 627.0/1200 * 100,
    previewRatio: BASE_HEIGHT/627,
  }, {
    group: 'facebook',
    name: 'facebook-milestone-with-image',
    label: 'صورة معلم حدث هام على الفيسبوك',
    width: 1200,
    height: 717,
    ratio: 717.0/1200 * 100,
    previewRatio: BASE_HEIGHT/717,
  }, {
    group: 'facebook',
    name: 'facebook-event-image',
    label: 'صورة صفحة حدث (event) على الفيسبوك',
    width: 1920,
    height: 1080,
    ratio: 1080.0/1920 * 100,
    previewRatio: BASE_HEIGHT/1080,
  }, {
    group: 'twitter',
    name: 'twitter-profile-photo',
    label: 'صورة ملف شخصي على تويتر',
    width: 800,
    height: 800,
    ratio: 800.0/800 * 100,
    previewRatio: BASE_HEIGHT/800,
  }, {
    group: 'twitter',
    name: 'twitter-header-photo',
    label: 'صورة الغطاء على تويتر',
    width: 1500,
    height: 500,
    ratio: 500.0/1500 * 100,
    previewRatio: BASE_HEIGHT/500,
  }, {
    group: 'twitter',
    name: 'twitter-in-stream-photo',
    label: 'صورة تشارك على تويتر',
    width: 1200,
    height: 600,
    ratio: 600.0/1200 * 100,
    previewRatio: BASE_HEIGHT/600,
  }, {
    group: 'instagram',
    name: 'instagram-profile-photo',
    label: 'صورة ملف شخصي على إنستجرام ',
    width: 800,
    height: 800,
    ratio: 800.0/800 * 100,
    previewRatio: BASE_HEIGHT/800,
  }, {
    group: 'instagram',
    name: 'instagram-square-photo',
    label: 'صورة مشاركة على إنستجرام (مربعة) ',
    width: 1200,
    height: 1200,
    ratio: 1200.0/1200 * 100,
    previewRatio: BASE_HEIGHT/1200,
  }, {
    group: 'instagram',
    name: 'instagram-non-square-photo',
    label: 'صورة مشاركة على إنستجرام (مستطيلة) ',
    width: 1200,
    height: 900,
    ratio: 900.0/1200 * 100,
    previewRatio: BASE_HEIGHT/900,
  }];

  constructor(
    public route: ActivatedRoute
  ) {
    this.text$
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(text => this.lines = text.split('\n'));
  }

  public ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.selectedPhoto = params['url'];
        this.selectedFont = params['font'];
        this.lines = params['lines'].split(',');
        this.text = this.lines.join('\n');

        const styleRules = `
        @font-face {
          font-family: '${this.selectedFont}';
          font-weight: normal;
          font-style: normal;
          src: url('https://fonts.carbon.tools/${this.selectedFont}.eot#iefix');
          src: url('https://fonts.carbon.tools/${this.selectedFont}.eot#iefix') format('embedded-opentype'),
              url('https://fonts.carbon.tools/${this.selectedFont}.woff2') format('woff2'),
              url('https://fonts.carbon.tools/${this.selectedFont}.woff') format('woff'),
              url('https://fonts.carbon.tools/${this.selectedFont}.ttf') format('truetype');
        }`;

        var styleEl = document.createElement('style');
        styleEl.innerHTML = styleRules;

        document.body.appendChild(styleEl);
      });
  }

  getClipFileName_(config, timestamp = new Date().getTime()) {
    return `${config.name}-${config.width}x${config.height}-${timestamp}.png`
  }

  download(optClip) {
    const timestamp = new Date().getTime();
    if (optClip) {
      optClip.preview = false;
      setTimeout(() => {
        optClip.export().then(blob => {
          FileSaver.saveAs(blob, this.getClipFileName_(optClip.config, timestamp));
          optClip.preview = true;
        });
      }, 200);
      return;
    } else {
      // Download all.
      this.preview = false;

      setTimeout(() => {
        const exportPromises = this.clips.map(clip => {
          return clip.export();
        });

        Promise.all(exportPromises).then(blobs => {
            var zip = new JSZip();
            zip.file('readme.txt', 'Thanks for using clips.manshar.com\nAlso checkout our arabic blogging platform manshar.com');

            this.clips.forEach((clip, index) => {
              var folder = zip.folder(clip.config.group);
              folder.file(this.getClipFileName_(clip.config, timestamp), blobs[index]);
            });

            zip.generateAsync({type: 'blob'})
            .then((content) => {
                FileSaver.saveAs(content, `manshar-clips-export-${timestamp}.zip`);
                this.preview = true;
            });

        }).catch(errors => {
          console.log('errors', errors);
        });
      }, 1000);
    }
  }

  ngAfterViewInit(){
    this.form.valueChanges
      .debounceTime(10)
      .distinctUntilChanged()
      .subscribe(value => console.log(value));
  }

}
