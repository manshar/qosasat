import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import FileSaver from 'file-saver';
import { ClipsPhotosSelectorComponent } from "../shared/clips-photos-selector/clips-photos-selector.component";
import { ClipsFontsSelectorComponent } from "../shared/clips-fonts-selector/clips-fonts-selector.component";
import { ClipsFormatsSelectorComponent } from "../shared/clips-formats-selector/clips-formats-selector.component";
import { ClipsSizesSelectorComponent } from "../shared/clips-sizes-selector/clips-sizes-selector.component";
import { YorwaQuotesSelectorComponent } from "../shared/yorwa-quotes-selector/yorwa-quotes-selector.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'single-step-editor',
  styleUrls: ['single-step-editor.component.css'],
  templateUrl: 'single-step-editor.component.html',
})

export class SingleStepEditorComponent implements OnInit {
  @ViewChild('textarea') private textarea;
  @ViewChild('previewEl') private previewEl;

  @ViewChild(ClipsPhotosSelectorComponent) private photosSelector;
  @ViewChild(ClipsFontsSelectorComponent) private fontsSelector;
  @ViewChild(ClipsFormatsSelectorComponent) private formatsSelector;
  @ViewChild(ClipsSizesSelectorComponent) private sizesSelector;
  @ViewChild(YorwaQuotesSelectorComponent) private quotesSelector;

  private photosReachedEnd$: Subject<any> = new Subject<any>();
  private quotesReachedEnd$: Subject<any> = new Subject<any>();

  private size: any = {width: 800, height: 800};
  private editMode: boolean = false;
  private photo: Object = {
    original_serve_url: 'https://images.unsplash.com/photo-1500161727381-144726b3a965'
  };
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
      .debounceTime(200)
      .subscribe(() => {
        this.photosSelector.loadNext();
      });

    this.quotesReachedEnd$
      .debounceTime(200)
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

  public updateText(text) {
    this.setEditMode(false);
    this.lines = text.split('\n').map((line) => {
      return line.trim();
    });
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
  }

  public download(clip) {
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
      photo: this.photo['original_serve_url'],
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

  public ngOnInit() {}

  private handleKeyup(event) {
    switch (event.keyCode) {
      case 27: // esc.
        this.setEditMode(false);
        break;
      default:
        break;
    }
  }
}