import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsPhotosService } from './clips-photos.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';
import 'rxjs/add/operator/map';

@Component({
  selector: 'clips-photos-selector',
  styleUrls: ['clips-photos-selector.component.css'],
  templateUrl: 'clips-photos-selector.component.html',
})
export class ClipsPhotosSelectorComponent implements OnInit {
  @ViewChild(ClipsSelectorComponent) private selector;
  @Output() private change = new EventEmitter<any>();
  private photos: Object[];

  constructor(private photosService: ClipsPhotosService) { }

  public ngOnInit() {
    this.photosService.list()
      .map((response) => response.result)
      .subscribe((photos) => {
        this.photos = photos;
        this.selector.select(this.photos[0]);
      });
  }

  public random() {
    this.selector.random();
  }

  public loadNext() {
    console.log('inside load next');
    this.photosService.nextList()
      .map((response) => response.result)
      .subscribe((photos) => {
        console.log('Got photos', photos);
        this.photos = this.photos.concat(photos);
      });
  }

  private removeItem(item) {
    this.photos.splice(this.photos.indexOf(item), 1);
  }

  private handleChange(event) {
    this.change.next({
      photo: event.item,
    });
  }

}