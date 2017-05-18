import {
  Component,
  Directive,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipComponent } from '../clip/clip.component';

import { FontLoader } from '../app.service';
import JSZip from 'jszip';
import FileSaver from 'file-saver';


@Component({
  selector: 'export',
  styleUrls: ['./export.component.css'],
  templateUrl: './export.component.html',
})
export class ExportComponent implements OnInit {
  @ViewChildren(ClipComponent) clips: QueryList<ClipComponent>;
  preview = true;
  selectedFont = '';
  selectedPhoto = '';
  text = '';
  configs = [{
    group: 'facebook',
    name: 'facebook-profile-photo',
    label: 'صورة الملف الشخصي على فيسبوك',
    width: 500,
    height: 500,
    ratio: 100,
  }, {
    group: 'facebook',
    name: 'facebook-cover-photo',
    label: 'صورة الغطاء على الملف الشخصي على فيسبوك',
    width: 820,
    height: 312,
    ratio: 312/820 * 100,
  }, {
    group: 'facebook',
    name: 'facebook-shared-image',
    label: 'صورة للمشاركة على فيسبوك',
    width: 1200,
    height: 630,
    ratio: 630.0/1200 * 100,
  }, {
    group: 'facebook',
    name: 'facebook-shared-link',
    label: 'صورة عرض لمقال مشارك على فيسبوك',
    width: 1200,
    height: 627,
    ratio: 627.0/1200 * 100,
  }, {
    group: 'facebook',
    name: 'facebook-milestone-with-image',
    label: 'صورة معلم حدث هام على الفيسبوك',
    width: 1200,
    height: 717,
    ratio: 717.0/1200 * 100,
  }, {
    group: 'facebook',
    name: 'facebook-event-image',
    label: 'صورة صفحة حدث (event) على الفيسبوك',
    width: 1920,
    height: 1080,
    ratio: 1080.0/1920 * 100,
  }, {
    group: 'twitter',
    name: 'twitter-profile-photo',
    label: 'صورة ملف شخصي على تويتر',
    width: 400,
    height: 400,
    ratio: 400.0/400 * 100,
  }, {
    group: 'twitter',
    name: 'twitter-header-photo',
    label: 'صورة الغطاء على تويتر',
    width: 1500,
    height: 500,
    ratio: 500.0/1500 * 100,
  }, {
    group: 'twitter',
    name: 'twitter-in-stream-photo',
    label: 'صورة تشارك على تويتر',
    width: 1200,
    height: 600,
    ratio: 600.0/1200 * 100,
  }, {
    group: 'instagram',
    name: 'instagram-profile-photo',
    label: 'صورة ملف شخصي على إنستجرام ',
    width: 400,
    height: 400,
    ratio: 400.0/400 * 100,
  }, {
    group: 'instagram',
    name: 'instagram-square-photo',
    label: 'صورة مشاركة على إنستجرام (مربعة) ',
    width: 1200,
    height: 1200,
    ratio: 1200.0/1200 * 100,
  }, {
    group: 'instagram',
    name: 'instagram-non-square-photo',
    label: 'صورة مشاركة على إنستجرام (مستطيلة) ',
    width: 1200,
    height: 900,
    ratio: 900.0/1200 * 100,
  }];

  constructor(
    public route: ActivatedRoute
  ) {}

  public ngOnInit() {
    console.log(this.route);
    this.route.queryParams.subscribe(
      params => {
        this.selectedPhoto = params['url'];
        this.selectedFont = params['font'];
        this.text = params['text'];
        this.loadFont(this.selectedFont);

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

  private loadFont(font) {
    // FontLoader.loadConfig('ar-fonts.json', [font]);
  }

  download() {
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
            folder.file(clip.config.name + '.png', blobs[index]);
          });

          zip.generateAsync({type: 'blob'})
          .then((content) => {
              FileSaver.saveAs(content, `manshar-clips-export-${new Date().getTime()}.zip`);
              this.preview = true;
          });

      }).catch(errors => {
        console.log('errors', errors);
      });
    }, 500);
  }
}
