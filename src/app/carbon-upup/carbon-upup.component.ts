import { Component, Output, Input, EventEmitter, OnInit, ViewChild, Renderer } from '@angular/core';
import { CarbonUpUpService } from './carbon-upup.service';

@Component({
  selector: 'carbon-upup',
  templateUrl: './carbon-upup.component.html',
  styleUrls: ['./carbon-upup.component.css']
})
export class CarbonUpUpComponent implements OnInit {
  @Input('label') label;
  @Input('uploadingLabel') uploadingLabel;
  @Input('dropLabel') dropLabel;
  @Input('dragLabel') dragLabel;
  @ViewChild('uploadButton') uploadButton;
  @ViewChild('previewAndProgress') previewAndProgress;
  @ViewChild('progressBar') progressBar;
  @ViewChild('previewImage') previewImage;
  @ViewChild('uploadingDone') uploadingDone;

  @Output() progress = new EventEmitter<number>();
  @Output() success = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();

  dragging = false;
  preview:boolean = false;
  progressValue = 0;
  constructor(
    public upup:CarbonUpUpService,
    private renderer: Renderer,
  ) { }

  ngOnInit() { }

  handleDragEnter_(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = true;
  }

  handleDragOver_(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = true;
  }

  handleDragLeave_() {
    this.dragging = false;
  }

  handleDrop_(event) {
    console.log('drop');
    event.preventDefault();
    event.stopPropagation();
    var files = event.dataTransfer.files;
    this.upload_(files[0]);
  };


  preview_(dataUri) {
    this.renderer.setElementAttribute(
        this.previewImage.nativeElement,
        'src', dataUri);
    this.preview = true;
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    this.upload_(file);
  }

  upload_(file) {
    var reader = new FileReader();
    reader.onload = e => {
      this.preview_(reader.result);
    };
    reader.readAsDataURL(file);

    // TODO Learn about Observables and maybe switch to using them
    // everywhere instead of mixing them with promises.
    this.upup.upload(file, progress => {
      console.log(progress);
      this.progress.emit(progress);
      this.renderer.setElementStyle(
        this.progressBar.nativeElement,
        'width',
        progress + '%');
    }).then(response => {
      console.log(response);
      this.success.emit(response)
    }, errors => {
      console.error(errors);
      this.error.emit(errors)
    });
  }
}