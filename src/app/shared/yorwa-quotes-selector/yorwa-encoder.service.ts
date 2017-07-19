import { Injectable } from '@angular/core';
import { YorwaHelpers } from './yorwa-helpers.service';

@Injectable()
export class YorwaEncoder {
  constructor(private helpers: YorwaHelpers) {}

  public encode(q: string): string {
    let res = '';
    res = this.helpers.replaceAll(q, 'ا', 'a');
    res = this.helpers.replaceAll(res, 'أ', '2');
    res = this.helpers.replaceAll(res, 'إ', 'E');
    res = this.helpers.replaceAll(res, 'ب', 'b');
    res = this.helpers.replaceAll(res, 'ت', 't');
    res = this.helpers.replaceAll(res, 'ث', 'T');
    res = this.helpers.replaceAll(res, 'ج', 'g');
    res = this.helpers.replaceAll(res, 'ح', '7');
    res = this.helpers.replaceAll(res, 'خ', '5');
    res = this.helpers.replaceAll(res, 'د', 'd');
    res = this.helpers.replaceAll(res, 'ذ', 'D');
    res = this.helpers.replaceAll(res, 'ر', 'r');
    res = this.helpers.replaceAll(res, 'ز', 'z');
    res = this.helpers.replaceAll(res, 'س', 's');
    res = this.helpers.replaceAll(res, 'ش', 'S');
    res = this.helpers.replaceAll(res, 'ص', 'c');
    res = this.helpers.replaceAll(res, 'ض', 'C');
    res = this.helpers.replaceAll(res, 'ط', '6');
    res = this.helpers.replaceAll(res, 'ظ', 'H');
    res = this.helpers.replaceAll(res, 'ع', '3');
    res = this.helpers.replaceAll(res, 'غ', 'G');
    res = this.helpers.replaceAll(res, 'ف', 'f');
    res = this.helpers.replaceAll(res, 'ق', 'q');
    res = this.helpers.replaceAll(res, 'ك', 'k');
    res = this.helpers.replaceAll(res, 'ل', 'l');
    res = this.helpers.replaceAll(res, 'م', 'm');
    res = this.helpers.replaceAll(res, 'ن', 'n');
    res = this.helpers.replaceAll(res, 'ه', 'h');
    res = this.helpers.replaceAll(res, 'و', 'w');
    res = this.helpers.replaceAll(res, 'ي', 'y');
    res = this.helpers.replaceAll(res, 'ة', 'i');
    res = this.helpers.replaceAll(res, 'ئ', 'I');
    res = this.helpers.replaceAll(res, 'ء', 'e');
    res = this.helpers.replaceAll(res, 'ؤ', 'o');
    res = this.helpers.replaceAll(res, 'ى', 'O');
    res = this.helpers.replaceAll(res, 'آ', 'Z');
    res = this.helpers.replaceAll(res, 'ّ', 'J');
    res = this.helpers.replaceAll(res, 'َ', 'p');
    res = this.helpers.replaceAll(res, 'ً', 'P');
    res = this.helpers.replaceAll(res, 'ُ', 'x');
    res = this.helpers.replaceAll(res, 'ٌ', 'X');
    res = this.helpers.replaceAll(res, 'ِ', 'v');
    res = this.helpers.replaceAll(res, 'ٍ', 'V');
    res = this.helpers.replaceAll(res, 'ْ', 'j');
    res = this.helpers.replaceAll(res, '،', ',');
    return res;
  };

}
