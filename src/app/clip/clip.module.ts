import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipComponent } from './clip.component';
import { ClipRenderService } from './clip-render.service';
import { FitTextComponent } from './fit-text.component';

@NgModule({
  imports: [ CommonModule ],
  exports: [
    ClipComponent,
    FitTextComponent,
  ],
  declarations: [
    ClipComponent,
    FitTextComponent,
  ],
  providers: [ ClipRenderService ]
})
export class ClipModule { }
