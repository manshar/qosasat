import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { YorwaQuotesService } from './yorwa-quotes.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'yorwa-quotes-selector',
  styleUrls: ['yorwa-quotes-selector.component.css'],
  templateUrl: 'yorwa-quotes-selector.component.html',
})
export class YorwaQuotesSelectorComponent implements OnInit {
  @ViewChild(ClipsSelectorComponent) private selector;
  @Output() private change = new EventEmitter<any>();
  private searching: boolean = false;
  private loading: boolean = false;
  private search$: EventEmitter<any> = new EventEmitter<any>();

  private quotes: Object[];
  private initialTerms: string[] = [
    'الحياة',
    'النشاط',
    'الحرية',
    'الإجتهاد',
    'إلهام',
    'العمل',
    'الحب',
    'الشجاعة',
    'العائلة',
    'الصداقة',
    'حبيبتي',
    'حبيبي',
    'الفضاء',
    'النجوم',
    'الأشجار',
    'الورود',
    'كاظم الساهر',
    'نزار القباني',
    'طوقان',
    'درويش',
  ];

  constructor(private quotesService: YorwaQuotesService) {
    this.search$
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((term) => {
        this.searching = true;
        if (term.trim().length > 0) {
          this.search(term, false);
        } else {
          this.list();
        }
      });
  }

  public ngOnInit() {
    this.list();
  }

  public list() {
    const index = Math.floor(Math.random() * this.initialTerms.length);
    this.search(this.initialTerms[index]);
  }

  public search(term, selectFirst: boolean = true) {
    this.loading = selectFirst;
    this.searching = true;
    this.quotesService.search({
      q: term,
    }).subscribe((quotes) => {
      this.searching = false;
      this.loading = false;
      this.quotes = quotes;
      this.selector.ready();
    }, (error) => {
      this.loading = false;
      this.searching = false;
    });
  }

  public random() {
    this.selector.random();
  }

  public loadNext() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.quotesService.nextSearch()
      .subscribe((quotes) => {
        this.loading = false;
        this.quotes = this.quotes.concat(quotes);
      }, () => this.loading = false);
  }

  public whenReady() {
    return this.selector.whenReady();
  }

  private removeItem(item) {
    this.quotes.splice(this.quotes.indexOf(item), 1);
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
      quote: JSON.parse(JSON.stringify(event.item)),
    });
  }

}