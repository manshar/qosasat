import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipsColorsSelectorComponent } from './clips-colors-selector.component';
import { ClipsColorsService } from './clips-colors.service';
import { ClipsSelectorComponent } from '../clips-selector/clips-selector.component';
import { ClipsSelectorModule } from '../clips-selector/clips-selector.module';

@NgModule({
  imports: [
    CommonModule,
    ClipsSelectorModule,
  ],
  exports: [
    ClipsColorsSelectorComponent,
  ],
  declarations: [
    ClipsColorsSelectorComponent,
  ],
  providers: [
    ClipsColorsService,
  ],
})
export class ClipsColorsModule { }
