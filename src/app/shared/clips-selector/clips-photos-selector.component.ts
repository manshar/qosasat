import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClipsPhotosService } from "./clips-photos.service";
import 'rxjs/add/operator/map';

@Component({
  selector: 'clips-photos-selector',
  styleUrls: ['clips-photos-selector.component.css'],
  templateUrl: 'clips-photos-selector.component.html',
})
export class ClipsPhotosSelectorComponent implements OnInit {
  photos:Object[];
  selectedPhoto:Object;
  focusedPhoto:Object;

  @Output() change = new EventEmitter<any>();

  constructor(private photosService:ClipsPhotosService) { }

  select(photo) {
    console.log('hello', photo);
    if (photo !== this.selectedPhoto) {
      this.selectedPhoto = photo;
      this.change.emit({
        photo: photo.original_serve_url,
      });
    }
  }

  ngOnInit() {
    this.photosService.list()
      .map(response => response.result)
      .subscribe(photos => {
        console.log(photos);
        this.photos = photos;
        this.select(photos[0]);
      });
  }

  handleFocusPhoto(photo) {
    this.focusedPhoto = photo;
  }

  handleBlurPhoto() {
    this.focusedPhoto = null;
  }

  handleKeyDown(event) {
    let selectedIndex = 0;
    switch(event.keyCode) {
      case 13: // enter.
        if (this.focusedPhoto) {
          this.select(this.focusedPhoto);
        }
        break
      case 39: // right.
      case 38: // up.
        selectedIndex = this.photos.indexOf(this.selectedPhoto);
        this.select(this.photos[Math.max(selectedIndex - 1, 0)]);
        break;
      case 37: // left.
      case 40: // down.
        selectedIndex = this.photos.indexOf(this.selectedPhoto);
        this.select(this.photos[Math.min(selectedIndex + 1, this.photos.length)]);
        break;
    }
  }

}