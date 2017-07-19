import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YorwaQuotesSelectorComponent } from './yorwa-quotes-selector.component';
import { ClipsSelectorModule } from '../clips-selector/clips-selector.module';
import { YorwaQuotesService } from './yorwa-quotes.service';
import { YorwaEncoder } from './yorwa-encoder.service';
import { YorwaDecoder } from './yorwa-decoder.service';
import { YorwaHelpers } from './yorwa-helpers.service';

@NgModule({
  imports: [
    CommonModule,
    ClipsSelectorModule,
  ],
  exports: [
    YorwaQuotesSelectorComponent,
  ],
  declarations: [
    YorwaQuotesSelectorComponent
  ],
  providers: [
    YorwaQuotesService,
    YorwaEncoder,
    YorwaDecoder,
    YorwaHelpers,
  ]
})
export class YorwaQuotesModule { }