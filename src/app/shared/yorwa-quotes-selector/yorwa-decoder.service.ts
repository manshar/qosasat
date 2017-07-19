import { Injectable } from '@angular/core';
import { YorwaHelpers } from './yorwa-helpers.service';

@Injectable()
export class YorwaDecoder {

  constructor(private helpers: YorwaHelpers) {}

  public decode(q: string): string {
    let res = '';
    res = this.helpers.replaceAll(q, 'a', 'ا');
    res = this.helpers.replaceAll(res, '2', 'أ');
    res = this.helpers.replaceAll(res, 'E', 'إ');
    res = this.helpers.replaceAll(res, 'b', 'ب');
    res = this.helpers.replaceAll(res, 't', 'ت');
    res = this.helpers.replaceAll(res, 'T', 'ث');
    res = this.helpers.replaceAll(res, 'g', 'ج');
    res = this.helpers.replaceAll(res, '7', 'ح');
    res = this.helpers.replaceAll(res, '5', 'خ');
    res = this.helpers.replaceAll(res, 'd', 'د');
    res = this.helpers.replaceAll(res, 'D', 'ذ');
    res = this.helpers.replaceAll(res, 'r', 'ر');
    res = this.helpers.replaceAll(res, 'z', 'ز');
    res = this.helpers.replaceAll(res, 's', 'س');
    res = this.helpers.replaceAll(res, 'S', 'ش');
    res = this.helpers.replaceAll(res, 'c', 'ص');
    res = this.helpers.replaceAll(res, 'C', 'ض');
    res = this.helpers.replaceAll(res, '6', 'ط');
    res = this.helpers.replaceAll(res, 'H', 'ظ');
    res = this.helpers.replaceAll(res, '3', 'ع');
    res = this.helpers.replaceAll(res, 'G', 'غ');
    res = this.helpers.replaceAll(res, 'f', 'ف');
    res = this.helpers.replaceAll(res, 'q', 'ق');
    res = this.helpers.replaceAll(res, 'k', 'ك');
    res = this.helpers.replaceAll(res, 'l', 'ل');
    res = this.helpers.replaceAll(res, 'm', 'م');
    res = this.helpers.replaceAll(res, 'n', 'ن');
    res = this.helpers.replaceAll(res, 'h', 'ه');
    res = this.helpers.replaceAll(res, 'w', 'و');
    res = this.helpers.replaceAll(res, 'y', 'ي');
    res = this.helpers.replaceAll(res, 'i', 'ة');
    res = this.helpers.replaceAll(res, 'I', 'ئ');
    res = this.helpers.replaceAll(res, 'e', 'ء');
    res = this.helpers.replaceAll(res, 'o', 'ؤ');
    res = this.helpers.replaceAll(res, 'O', 'ى');
    res = this.helpers.replaceAll(res, 'Z', 'آ');
    res = this.helpers.replaceAll(res, 'J', 'ّ');
    res = this.helpers.replaceAll(res, 'p', 'َ');
    res = this.helpers.replaceAll(res, 'P', 'ً');
    res = this.helpers.replaceAll(res, 'x', 'ُ');
    res = this.helpers.replaceAll(res, 'X', 'ٌ');
    res = this.helpers.replaceAll(res, 'v', 'ِ');
    res = this.helpers.replaceAll(res, 'V', 'ٍ');
    res = this.helpers.replaceAll(res, 'j', 'ْ');
    res = this.helpers.replaceAll(res, ',', '،');
    return res;
  };
}
