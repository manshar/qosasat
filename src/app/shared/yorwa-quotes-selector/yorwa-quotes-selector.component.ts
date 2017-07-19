import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { YorwaQuotesService } from './yorwa-quotes.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';
import 'rxjs/add/operator/map';

@Component({
  selector: 'yorwa-quotes-selector',
  styleUrls: ['yorwa-quotes-selector.component.css'],
  templateUrl: 'yorwa-quotes-selector.component.html',
})
export class YorwaQuotesSelectorComponent implements OnInit {
  @ViewChild(ClipsSelectorComponent) private selector;
  @Output() private change = new EventEmitter<any>();

  private quotes: Object[];
  private initialTerms: string[] = [
    'الحياة',
    'النشاط',
    'الحرية',
    'الإجتهاد',
    'إلهام',
    'العمل',
  ];

  constructor(private quotesService: YorwaQuotesService) { }

  public ngOnInit() {
    const index = Math.floor(Math.random() * this.initialTerms.length);
    this.quotesService.search({
      q: this.initialTerms[index],
    }).subscribe((quotes) => {
      this.quotes = quotes;
      this.selector.select(this.quotes[0]);
    }, (error) => {
      console.log(error);
    });
  }

  public random() {
    this.selector.random();
  }

  public loadNext() {
    this.quotesService.nextSearch()
      .subscribe((quotes) => {
        this.quotes = this.quotes.concat(quotes);
      });
  }

  private removeItem(item) {
    this.quotes.splice(this.quotes.indexOf(item), 1);
  }

  private handleChange(event) {
    this.change.next({
      quote: event.item,
    });
  }

}