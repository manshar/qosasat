import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarbonUpUpService } from './carbon-upup.service';
import { CarbonUpUpComponent } from './carbon-upup.component';


@NgModule({
  declarations: [
    CarbonUpUpComponent,
  ],
  imports: [ CommonModule ],
  exports: [
    CarbonUpUpComponent,
  ],
  providers: [
    CarbonUpUpService,
  ],
  bootstrap: []
})
export class CarbonUpUpModule {}
