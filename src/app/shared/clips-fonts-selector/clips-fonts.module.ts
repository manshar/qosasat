import { NgModule } from '@angular/core';

import { ClipsFontsSelectorComponent } from './clips-fonts-selector.component';
import { ClipsFontsService } from "./clips-fonts.service";
import { CommonModule } from "@angular/common";
import { ClipsSelectorComponent } from "../clips-selector/clips-selector.component";
import { ClipsSelectorModule } from "../clips-selector/clips-selector.module";

@NgModule({
  imports: [
    CommonModule,
    ClipsSelectorModule,
  ],
  exports: [
    ClipsFontsSelectorComponent,
  ],
  declarations: [
    ClipsFontsSelectorComponent,
  ],
  providers: [
    ClipsFontsService,
  ],
})
export class ClipsFontsModule { }
