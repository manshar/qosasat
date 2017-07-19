import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipsPhotosSelectorComponent } from './clips-photos-selector.component';
import { ClipsPhotosService } from './clips-photos.service';
import { ClipsSelectorComponent } from "../clips-selector";
import { ClipsSelectorModule } from "../clips-selector/clips-selector.module";

@NgModule({
  imports: [
    CommonModule,
    ClipsSelectorModule,
  ],
  exports: [
    ClipsPhotosSelectorComponent,
  ],
  declarations: [
    ClipsPhotosSelectorComponent,
  ],
  providers: [
    ClipsPhotosService,
  ],
})
export class ClipsPhotosModule { }
