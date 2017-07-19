import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ClipsSelectorModule } from '../clips-selector/clips-selector.module'
import { ClipsFormatsSelectorComponent } from "./clips-formats-selector.component";
import { ClipsFormatsService } from "./clips-formats.service";

@NgModule({
  imports: [
    ClipsSelectorModule,
    CommonModule,
  ],
  exports: [
    ClipsFormatsSelectorComponent,
  ],
  declarations: [
    ClipsFormatsSelectorComponent,
  ],
  providers: [
    ClipsFormatsService,
  ]
})
export class ClipsFormatsModule { }