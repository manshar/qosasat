import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ClipsSelectorModule } from "../clips-selector/clips-selector.module";
import { ClipsSizesSelectorComponent } from "./clips-sizes-selector.component";
import { ClipsSizesService } from "./clips-sizes.service";


@NgModule({
  imports: [
    CommonModule,
    ClipsSelectorModule,
  ],
  exports: [
    ClipsSizesSelectorComponent,
  ],
  declarations: [
    ClipsSizesSelectorComponent,
  ],
  providers: [
    ClipsSizesService,
  ]
})
export class ClipsSizesModule { }