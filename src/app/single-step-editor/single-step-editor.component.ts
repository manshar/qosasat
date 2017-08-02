import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import FileSaver from 'file-saver';
import {
  ClipsPhotosSelectorComponent,
} from '../shared/clips-photos-selector/clips-photos-selector.component';
import {
  ClipsFontsSelectorComponent,
} from '../shared/clips-fonts-selector/clips-fonts-selector.component';
import {
  ClipsFormatsSelectorComponent,
} from '../shared/clips-formats-selector/clips-formats-selector.component';
import {
  ClipsSizesSelectorComponent,
} from '../shared/clips-sizes-selector/clips-sizes-selector.component';
import {
  YorwaQuotesSelectorComponent,
} from '../shared/yorwa-quotes-selector/yorwa-quotes-selector.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Photo } from '../shared/clips-photos-selector/clips-photo.model';
import { ClipComponent } from '../clip/clip.component';
import {
  ClipsExportManagerComponent,
} from '../shared/clips-export-manager/clips-export-manager.component';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import { ClipsColorsSelectorComponent } from "../shared/clips-colors-selector/clips-colors-selector.component";

// tslint:disable-next-line:max-line-length
const EMOJI_REGEX = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/gi;

@Component({
  selector: 'single-step-editor',
  styleUrls: ['single-step-editor.component.css'],
  templateUrl: 'single-step-editor.component.html',
})
export class SingleStepEditorComponent implements OnInit {
  newTabMode: boolean;
  public queuedExportsCount: number = 0;
  public isEmbedMode: boolean = false;
  public embeddedOrigin: string;
  public viewMode: boolean = false;

  @ViewChild('textarea') private textarea;
  @ViewChild('previewEl') private previewEl;
  @ViewChild(ClipComponent) private clip;

  @ViewChild(ClipsPhotosSelectorComponent) private photosSelector;
  @ViewChild(ClipsFontsSelectorComponent) private fontsSelector;
  @ViewChild(ClipsFormatsSelectorComponent) private formatsSelector;
  @ViewChild(ClipsSizesSelectorComponent) private sizesSelector;
  @ViewChild(YorwaQuotesSelectorComponent) private quotesSelector;
  @ViewChild(ClipsColorsSelectorComponent) private colorsSelector;

  @ViewChild(ClipsExportManagerComponent) private exportManager;

  private swipeUpControls$: Subject<any> = new Subject<any>();
  private swipeDownControls$: Subject<any> = new Subject<any>();
  private photosReachedEnd$: Subject<any> = new Subject<any>();
  private quotesReachedEnd$: Subject<any> = new Subject<any>();

  private imageFailedToLoad: boolean;
  private visibleControls: boolean = false;
  private downloading: boolean = false;
  private size: any = {width: 800, height: 800};
  private editMode: boolean = false;
  private photo: Photo;
  private font: string;
  private lines: string[];
  private text: string;

  private previewRatio: number = 1;
  private textFill: string = 'p90';
  private textPos: string = 'mc';
  private textFit: string = 'fit';
  private textColor: string;
  private exporterIframeSrc: SafeUrl;

  constructor(private renderer: Renderer,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute) {
    this.photosReachedEnd$
      .subscribe(() => {
        this.photosSelector.loadNext();
      });

    this.quotesReachedEnd$
      .subscribe(() => {
        this.quotesSelector.loadNext();
      });

    this.swipeDownControls$
      .debounceTime(50)
      .subscribe(() => {
        this.hideControls();
      });
    this.swipeUpControls$
      .debounceTime(50)
      .subscribe(() => {
        this.showControls();
      });

  }

  public setEditMode(mode) {
    if (this.viewMode) {
      return;
    }
    this.editMode = mode;
    if (mode) {
      setTimeout(() => {
        this.renderer.invokeElementMethod(
          this.textarea.nativeElement,
          'select');
      }, 1);
    } else {
      setTimeout(() => {
        this.renderer.invokeElementMethod(
          this.previewEl.nativeElement,
          'focus');
      }, 1);
    }
  }

  public loadRandomPhoto() {
    this.photosSelector.random();
  }

  public updateColor(color) {
    this.textColor = color.value;
  }
  public updateText(text) {
    this.setEditMode(false);
    this.lines = this._calcLines(text);
    this.text = this.lines.join('\n');
  }

  public updatePhoto(event) {
    this.imageFailedToLoad = false;
    this.photo = event.photo;
  }

  public updateFont(event) {
    this.font = event.font;
  }

  public updateFormats(event) {
    this[event.format.type] = event.format.value;
  }

  public updateSize(event) {
    this.size = {
      width: event.size.width,
      height: event.size.height,
    };
  }

  public updateQuote(event) {
    const MAX_WORDS_PER_LINE = 8;
    this.lines = event.quote.quote.split(/[,.\n!:،]/);
    this.lines = this.lines.filter((line) => line.trim().length > 0);
    if (this.lines.length < 2) {
      const words = this.lines[0].split(/\s/);
      const newLines = [];
      while (words.length > 0) {
        newLines.push(
          words.splice(0, Math.floor(Math.random() * MAX_WORDS_PER_LINE) + 2).join(' '));
      }
      this.lines = newLines;
    }
    this.text = this.lines.join('\n');
    this.lines = this._calcLines(this.text);
  }

  public download(clip) {
    const config = {
      id: 'export-' + new Date().getTime(),
      lines: this.lines,
      photo: {
        url: this.photo.servingUrl,
        sourceName: this.photo.sourceName,
      },
      font: this.font,
      textFill: this.textFill,
      textFit: this.textFit,
      textPos: this.textPos,
      textColor: this.textColor,
      size: this.size,
      nophoto: this.imageFailedToLoad,
    };
    this.exportManager.add(config);
    this.queuedExportsCount++;
  }

  public random() {
    this.imageFailedToLoad = false;
    this.photosSelector.random();
    this.fontsSelector.random();
    if (this.newTabMode && this.viewMode) {
      // this.sizesSelector.select(1);
      this.formatsSelector.random();
      this.formatsSelector.selectFill(2);
    } else {
      this.formatsSelector.selectFill(0);
      this.sizesSelector.random();
    }
    this.quotesSelector.random();
    // this.colorsSelector.random();
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isEmbedMode = params['embedded'] === '1';
      this.embeddedOrigin = params['embeddedOrigin'];
      this.newTabMode = params['mode'] === 'chrome-new-tab';
      this.viewMode = this.newTabMode;
      if (this.newTabMode) {
        this.size = {
          width: window.innerWidth || 1600,
          height: window.innerHeight || 900
        };
      }

      if (params['config']) {
        const config = JSON.parse(decodeURIComponent(params['config']));
        for (let key of config) {
          if (key === 'photo') {
            this[key] = new Photo(config[key]);
          } else {
            this[key] = config[key];
          }
        }
      }
    });

    Promise.all([
      this.fontsSelector.whenReady().then(() => console.log('fontsSelector ready')),
      this.formatsSelector.whenReady().then(() => console.log('formatsSelector ready')),
      this.photosSelector.whenReady().then(() => console.log('photosSelector ready')),
      this.quotesSelector.whenReady().then(() => console.log('quotesSelector ready')),
      this.sizesSelector.whenReady().then(() => console.log('sizesSelector ready')),
    ]).then(() => this.random());
  }

  public handleExportComplete(event) {
    if (this.isEmbedMode) {
      parent.postMessage({
        export: {
          blob: event.data.blob,
        },
        input: {
          lines: this.lines,
          text: this.text,
          photo: {
            url: this.photo.servingUrl,
            sourceName: this.photo.sourceName,
          },
          font: this.font,
        },
        selectedOptions: {
          // textColor: this.textColor,
          textFill: this.textFill,
          textPos: this.textPos,
          textFit: this.textFit,
        }
      }, this.embeddedOrigin);
    } else {
      FileSaver.saveAs(event.data.blob, event.data.id + '.png');
    }
    this.queuedExportsCount--;
  }

  public showControls() {
    if (!this.visibleControls) {
      this.visibleControls = true;
      setTimeout(() => this.clip.refit(), 300);
    }
  }

  public hideControls() {
    if (this.visibleControls) {
      this.visibleControls = false;
      setTimeout(() => this.clip.refit(), 300);
    }
  }

  public handleSwipeDownOnControls(event) {
    console.log(event);
    this.hideControls();
  }

  private handleKeypress(event) {
    switch (event.keyCode) {
      case 13: // enter.
        if (!this.editMode) {
          this.setEditMode(true);
        }
        break;
      default:
        break;
    }
  }

  private handleKeyup(event) {
    switch (event.keyCode) {
      case 27: // esc.
        if (this.editMode) {
          this.setEditMode(false);
        }
        break;
      default:
        break;
    }
  }

  private _calcLines(text) {
    return text.split('\n').map((line) => {
      let fixedLine = line.trim();
      if (this._hasEmoji(fixedLine)) {
        fixedLine = this._maybePadEmojiString(fixedLine, 35);
      }
      return fixedLine;
    });
  }

  private _maybePadEmojiString(str, targetLength, padChar = '\u00A0') {
    const padArr = [];
    const strLength = this._emojiCount(str) + this._removeEmoji(str).length;
    while ((padArr.length * 2) + strLength < targetLength) {
      padArr.push(padChar);
    }
    return `${padArr.join('')}${str}${padArr.join('')}`;
  }

  private _onlyEmoji(str) {
    return str.length > 0 && str.replace(EMOJI_REGEX, '').length === 0;
  }

  private _removeEmoji(str) {
    return str.replace(EMOJI_REGEX, '');
  }

  private _hasEmoji(str) {
    return str.length > 0 && EMOJI_REGEX.test(str);
  }

  private _emojiCount(str) {
    const lengthBefore = str.length;
    return (lengthBefore - str.replace(EMOJI_REGEX, '').length) / 2;
  }


}
