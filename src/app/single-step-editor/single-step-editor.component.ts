import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import FileSaver from 'file-saver';
import { ClipsPhotosSelectorComponent } from "../shared/clips-photos-selector/clips-photos-selector.component";
import { ClipsFontsSelectorComponent } from "../shared/clips-fonts-selector/clips-fonts-selector.component";
import { ClipsFormatsSelectorComponent } from "../shared/clips-formats-selector/clips-formats-selector.component";
import { ClipsSizesSelectorComponent } from "../shared/clips-sizes-selector/clips-sizes-selector.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'single-step-editor',
  styleUrls: ['single-step-editor.component.css'],
  templateUrl: 'single-step-editor.component.html',
})

export class SingleStepEditorComponent implements OnInit {
  @ViewChild('textarea') textarea;
  @ViewChild('previewEl') previewEl;

  @ViewChild(ClipsPhotosSelectorComponent) photosSelector;
  @ViewChild(ClipsFontsSelectorComponent) fontsSelector;
  @ViewChild(ClipsFormatsSelectorComponent) formatsSelector;
  @ViewChild(ClipsSizesSelectorComponent) sizesSelector;

  photosReachedEnd$:Subject = new Subject();

  size: any = {width: 800, height: 800};
  editMode:boolean = false;
  photo:Object = {
    original_serve_url: 'https://images.unsplash.com/photo-1500161727381-144726b3a965'
  };
  font:string = 'barabics';
  lines:string[] = [
    'مرحباً بالعالم',
    'ما الذي يلهمكم ويجعلكم تبتسمون اليوم؟',
  ];
  previewRatio:number = 1;
  textFill = 'p90';
  textPos = 'mc';
  textFit = 'fit';


  exporterIframeSrc:SafeUrl;
  constructor(private renderer:Renderer,
              private sanitizer: DomSanitizer) {
    this.photosReachedEnd$
      .debounceTime(200)
      .subscribe(() => {
        this.photosSelector.loadNext();
      });
  }

  setEditMode(mode) {
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

  updateText(text) {
    this.setEditMode(false);
    this.lines = text.split('\n').map(line => {
      return line.trim();
    });
  }

  updatePhoto(event) {
    this.photo = event.photo;
  }

  updateFont(event) {
    this.font = event.font;
  }

  updateFormats(event) {
    this[event.format.type] = event.format.value;
  }

  updateSize(event) {
    this.size = {
      width: event.size.width,
      height: event.size.height,
    };
  }

  handleKeyup(event) {
    switch(event.keyCode) {
      case 27: // esc.
        this.setEditMode(false);
        break
    }
  }

  download(clip) {
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

  random() {
    this.photosSelector.random();
    this.fontsSelector.random();
    this.formatsSelector.random();
    this.sizesSelector.random();
  }

  ngOnInit() {}
}