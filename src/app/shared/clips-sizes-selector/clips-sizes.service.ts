import { Injectable } from '@angular/core';

@Injectable()
export class ClipsSizesService {

  availableSizes = [{
    name: 'صورة مربعة',
    iconWidth: '90px',
    iconHeight: '90px',
    width: 1200,
    height: 1200,
  }, {
    name: 'صورة عرضية',
    iconWidth: '160px',
    iconHeight: '90px',
    width: 1600,
    height: 900,
  }, {
    name: 'صورة عمودية',
    iconWidth: '50px',
    iconHeight: '90px',
    width: 675,
    height: 1200,
  }, ];

  constructor() { }

  getAvailableSizes() {
    return this.availableSizes;
  }
}