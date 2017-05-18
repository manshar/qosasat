import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ColorPickerComponent } from './color-picker.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        ColorPickerComponent
     ],
    exports: [
        ColorPickerComponent
    ]
})
export class ColorPickerModule {
    public static forRoot(options: any = {}, module: string = 'default') {
        return {
            ngModule: ColorPickerModule
        }
    }
 }
