import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipsPhotosService } from './clips-photos.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Photo } from './clips-photo.model';

@Component({
  selector: 'clips-photos-selector',
  styleUrls: ['clips-photos-selector.component.css'],
  templateUrl: 'clips-photos-selector.component.html',
})
export class ClipsPhotosSelectorComponent implements OnInit {
  @ViewChild(ClipsSelectorComponent) private selector;
  @Output() private change = new EventEmitter<any>();
  private photos: Photo[];
  private loading: boolean = true;
  private searching: boolean = false;
  private search$: EventEmitter<any> = new EventEmitter<any>();
  private loadNextMethod: Function;

  constructor(private photosService: ClipsPhotosService) {
    this.search$
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((term) => {
        this.searching = true;
        if (term.trim().length > 0) {
          this.search(term);
        } else {
          this.list(false);
        }
      });
  }

  public list(selectFirst: boolean = true) {
    this.photosService.list()
      .subscribe((photos) => {
        this.loading = false;
        this.loadNextMethod = this.photosService.nextList.bind(this.photosService);
        this.photos = photos;
        this.searching = false;
        if (selectFirst) {
          this.selector.select(this.photos[0]);
        }
      }, () => this.loading = false);
  }
  public ngOnInit() {
    this.list();
  }

  public random() {
    this.selector.random();
  }

  public loadNext() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.loadNextMethod()
      .subscribe((photos) => {
        this.loading = false;
        this.photos = this.photos.concat(photos);
      }, () => this.loading = false, () => {
        this.searching = false;
        this.loading = false;
      });
  }

  public search(term) {
    this.photosService.search({
      q: term,
    }).subscribe((photos) => {
        this.loading = false;
        this.loadNextMethod = this.photosService.nextSearch.bind(this.photosService);
        this.photos = photos;
        this.searching = false;
      }, () => this.loading = false, () => {
        this.searching = false;
        this.loading = false;
      });
  }

  private handleUploadPhoto(event) {
    const data = event.result;
    data['source_name'] = data['source_name'] || 'CarbonUpUp';
    const newPhoto = new Photo(data);
    this.photos.splice(0, 0, newPhoto);
    this.selector.select(newPhoto);
  }

  private removeItem(item) {
    this.photos.splice(this.photos.indexOf(item), 1);
  }

  private handleSearchChange(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  private handleChange(event) {
    if (!event.item) {
      return;
    }
    this.change.next({
      photo: event.item,
    });
  }

}