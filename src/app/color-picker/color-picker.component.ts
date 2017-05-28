import { Component, Input, Output, EventEmitter, OnInit, Self } from '@angular/core';
import { NgModel, ControlValueAccessor } from '@angular/forms';

import { ColorPickerConfiguration } from './color-picker-config.model';
import { IColorPickerConfiguration } from './color-picker-config.interface';

@Component({
    selector: `color-picker[ngModel]`,
    template: `
        <div class="color-picker-container" [class.showDropdown]="showDropdown">
            <span class="clear-selection"
                *ngIf="selectedColorsItems?.length > 0 && multiple"
                [style.width]="config.width + 'px'"
                [style.height]="config.height + 'px'"
                (click)="clearSelectedColors()">
                x
            </span>
            <span class="color-picker-icon dropdown-toggle"
                [style.width]="config.width + 'px'"
                [style.height]="config.height + 'px'"
                [style.border-radius]="config.borderRadius + 'px'"
                (click)="toggleDropdown()">
            </span>
            <span class="current-color selected-color dropdown-toggle"
                *ngFor="let color of selectedColorsItems"
                [style.width]="config.width + 'px'"
                [style.height]="config.height + 'px'"
                [style.background-color]="'#' + color"
                (click)="toggleDropdown()">
            </span>
            <div class="dropdown-menu color-picker-dropdown"
                role="menu">
                <label class="color-picker-color"
                    *ngFor="let color of availableColors"
                    [style.width]="config.width + 'px'"
                    [style.height]="config.height + 'px'"
                    [style.border-radius]="config.borderRadius + 'px'"
                    [style.background-color]="'#' + color"
                    (click)="updateColors($event.target.title)"
                    [title]="color">
                    <input type="checkbox" [(ngModel)]="selectedColors[color]">
                </label>
            </div>
        </div>
    `,
    styles: [
        `.color-picker-container {
            display: flex;
            position: relative;
            justify-content: center;
          }

          .selected-color {
            border-radius: 50%;
            display: inline-block;
          }

          .color-picker-icon {
            background: url('/assets/icon/colorwheel.png') no-repeat;
            display: inline-block;
            background-size: 25px;
          }
        .color-picker-container .dropdown-menu {
          display: none;
          position: absolute;
          width: 300px;
          top: 30px;
          z-index: 9999;
        }
        .color-picker-container.showDropdown .dropdown-menu {
          display: block;
        }

        .dropdown-toggle {
          cursor: pointer;
        }

        .clear-selection {
          border: 1px solid #aaa;
          color: #aaa;
          line-height: 1.8;
          border-radius: 50%;
          margin-left: 2px;
          cursor: pointer;
        }

        .clear-selection:hover {
          background: #000;
          color: #fff;
          border: 1px solid #fff;
        }
            `,

        `.current-color {
            display: inline-block;
            cursor: pointer; }`,

        `.color-picker-color {
            display: inline-block;
            cursor: pointer; }`,

        `.color-picker-dropdown {
            padding-bottom: 0;
        }

        input[type=checkbox] {
          visibility: hidden;
        }

        input[type=checkbox]:checked {
          visibility: visible;
        }
        `
    ],
    providers: [ NgModel ]
})
export class ColorPickerComponent implements ControlValueAccessor, OnInit {

    public cd: NgModel;

    public onChange: any = Function.prototype;

    public onTouched: any = Function.prototype;

    public config: ColorPickerConfiguration;

    public selectedColors = {};
    @Input() selectedColorsItems:string[];
    showDropdown:boolean = false;

    @Input() pickerConfig: IColorPickerConfiguration;

    @Input() availableColors: string[];
    @Input() multiple:boolean = true;

    @Output() onChangeModel = new EventEmitter();
    change() {
        this.onChangeModel.emit({value: this.cd});
    }

    constructor(@Self() cd: NgModel) {
        this.cd = cd;
        cd.valueAccessor = this;

        this.config = new ColorPickerConfiguration();
    }

    /** OnInit implementation. */
    ngOnInit() {
        this._processOptions(this.pickerConfig);
    }

    /** ControlValueAccessor implementation. */
    writeValue(value: any): void { }

    /** ControlValueAccessor implementation. */
    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    /** ControlValueAccessor implementation. */
    registerOnTouched(fn: (_: any) => {}): void {
        this.onTouched = fn;
    }


    public clearSelectedColors() {
      for (var key in this.selectedColors) {
        this.selectedColors[key] = false;
      }
      this.updateColors();
      this.change();
    }

    /**
     * Update the current color based on selection.
     *
     * @param {string} color
     *
     * @memberOf ColorPickerComponent
      */
    public updateColors(color = null) {
      if (!this.multiple && color) {
        this.selectedColors = {};
        console.log('update color: ', color);
        this.selectedColors[color] = true;
      }

      this.cd.viewToModelUpdate(this.selectedColors);

      setTimeout(() => {
        var keys = Object.keys(this.selectedColors);
        const filters = this.selectedColors;
        var filtered = keys.filter(function(key) {
          return filters[key];
        });
        this.showDropdown = false;
        this.selectedColorsItems = filtered;
        this.onTouched();
      }, 10);
    }

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    }

    /**
     * Wire up configuration.
     *
     * @private
     * @param {IColorPickerConfiguration} opts
     *
     * @memberOf ColorPickerComponent
     */
    private _processOptions(opts: IColorPickerConfiguration) {
        if (opts != null) {

            const IsNumber = (val: any) => typeof(val) === 'number';
            const IsArray = (val: any) => Array.isArray(val);

            // width
            if (IsNumber(opts.width)) {
                this.config.width = opts.width;
            }

            // height
            if (IsNumber(opts.height)) {
                this.config.height = opts.height;
            }

            // borderRadius
            if (IsNumber(opts.borderRadius)) {
                this.config.borderRadius = opts.borderRadius;
            }
        }

        if (this.availableColors == null) {
            console.warn('[ng2-color-picker] No available colors provided.');
        }
    }
}