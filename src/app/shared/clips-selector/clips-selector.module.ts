import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipsSelectorComponent } from "../clips-selector";

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ClipsSelectorComponent,
  ],
  declarations: [
    ClipsSelectorComponent,
  ],
  providers: [
  ],
})
export class ClipsSelectorModule { }
