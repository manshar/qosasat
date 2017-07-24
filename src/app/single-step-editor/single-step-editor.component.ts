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
import { Photo } from "../shared/clips-photos-selector/clips-photo.model";
import { ClipComponent } from "../clip/clip.component";


// tslint:disable-next-line:max-line-length
const EMOJI_REGEX = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/gi;

@Component({
  selector: 'single-step-editor',
  styleUrls: ['single-step-editor.component.css'],
  templateUrl: 'single-step-editor.component.html',
})
export class SingleStepEditorComponent implements OnInit {
  @ViewChild('textarea') private textarea;
  @ViewChild('previewEl') private previewEl;
  @ViewChild(ClipComponent) private clip;

  @ViewChild(ClipsPhotosSelectorComponent) private photosSelector;
  @ViewChild(ClipsFontsSelectorComponent) private fontsSelector;
  @ViewChild(ClipsFormatsSelectorComponent) private formatsSelector;
  @ViewChild(ClipsSizesSelectorComponent) private sizesSelector;
  @ViewChild(YorwaQuotesSelectorComponent) private quotesSelector;

  private photosReachedEnd$: Subject<any> = new Subject<any>();
  private quotesReachedEnd$: Subject<any> = new Subject<any>();

  private visibleControls: boolean = false;
  private downloading: boolean = false;
  private size: any = {width: 800, height: 800};
  private editMode: boolean = false;
  private photo: Photo = new Photo({
    original_serve_url: 'https://images.unsplash.com/photo-1500161727381-144726b3a965',
    source_name: 'Unsplash',
  });
  private font: string = 'barabics';
  private lines: string[] = [
    'مرحباً بالعالم',
    'ما الذي يلهمكم ويجعلكم تبتسمون اليوم؟',
  ];
  private text: string = [
    'مرحباً بالعالم',
    'ما الذي يلهمكم ويجعلكم تبتسمون اليوم؟',
  ].join('\n');

  private previewRatio: number = 1;
  private textFill: string = 'p90';
  private textPos: string = 'mc';
  private textFit: string = 'fit';
  private exporterIframeSrc: SafeUrl;

  constructor(private renderer:Renderer,
              private sanitizer: DomSanitizer) {
    this.photosReachedEnd$
      .subscribe(() => {
        this.photosSelector.loadNext();
      });

    this.quotesReachedEnd$
      .subscribe(() => {
        this.quotesSelector.loadNext();
      });
  }

  public setEditMode(mode) {
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

  public updateText(text) {
    this.setEditMode(false);
    this.lines = this._calcLines(text);
    this.text = this.lines.join('\n');
  }

  public updatePhoto(event) {
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
    this.downloading = true;
    // TODO(mk): Need to figure out a way to render in different sizes.
    // TODO(mk): Need to figure out a way to avoid re-downloading all fonts and only
    // requesting needed stuff.
    // These two could possibly be solved by having a separate route like
    // /raw-export#{config: ''} that can be embedded in an iframe and
    // executes the export inside of itself.
    // That iframe could either make the download there or just postMessage
    // to app the output blob.

    // TODO(mk): For every size, create an iframe and use postmessage to select multiple
    // sizes and export them...

    const config = {
      lines: this.lines,
      photo: {
        url: this.photo.servingUrl,
        sourceName: this.photo.sourceName,
      },
      font: this.font,
      textFill: this.textFill,
      textFit: this.textFit,
      textPos: this.textPos,
      size: this.size,
    };
    const encodeConfig = encodeURIComponent(JSON.stringify(config));
    this.exporterIframeSrc = this.sanitizer
      .bypassSecurityTrustResourceUrl(
          `//${document.location.host}/download?config=${encodeConfig}`);
  }

  public random() {
    this.photosSelector.random();
    this.fontsSelector.random();
    this.formatsSelector.random();
    this.sizesSelector.random();
    this.quotesSelector.random();
  }

  public ngOnInit() {
    window.addEventListener('message', (e) => {
      if (e.data && e.data.blob) {
        const timestamp = new Date().getTime();
        FileSaver.saveAs(e.data.blob, timestamp + '.png');
        this.downloading = false;
      }
    });
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
