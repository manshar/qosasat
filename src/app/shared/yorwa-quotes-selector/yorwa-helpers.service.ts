import { Injectable } from '@angular/core';

@Injectable()
export class YorwaHelpers {
  public replaceAll(
    original: string,
    findStr: string,
    replaceStr: string,
    ignoreCase: boolean = false
  ): string {
    const regexFlags = ignoreCase ? 'gi' : 'g';
    const REGEX = /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g;
    return original.replace(
      new RegExp(findStr.replace(REGEX, '\\$&'), regexFlags),
      (typeof (replaceStr) === 'string') ? replaceStr.replace(/\$/g, '$$$$') : replaceStr);
  }
}
