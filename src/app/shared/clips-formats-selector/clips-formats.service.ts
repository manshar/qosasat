import { Injectable } from '@angular/core';

@Injectable()
export class ClipsFormatsService {

  availableFormats = {
    textFillChoices: [{
      type: 'textFill',
      name: '90%',
      value: 'p90',
    }, {
      type: 'textFill',
      name: '75%',
      value: 'p75',
    }, {
      type: 'textFill',
      name: '50%',
      value: 'p50',
    }, {
      type: 'textFill',
      name: '35%',
      value: 'p35',
    }, {
      type: 'textFill',
      name: '25%',
      value: 'p25',
    }, {
      type: 'textFill',
      name: '10%',
      value: 'p10',
    },],
    textFitChoices: [{
      type: 'textFit',
      name: 'حجم خط متغير',
      value: 'fit',
    }, {
      type: 'textFit',
      name: 'حجم خط ثابت',
      value: 'nofit',
    }, ],
    textPosChoices: [{
      type: 'textPos',
      name: 'أعلى اليمين',
      value: 'tr',
    }, {
      type: 'textPos',
      name: 'أعلى الوسط',
      value: 'tc',
    }, {
      type: 'textPos',
      name: 'أعلى اليسار',
      value: 'tl',
    }, {
      type: 'textPos',
      name: 'وسط اليمين',
      value: 'mr',
    }, {
      type: 'textPos',
      name: 'وسط الوسط',
      value: 'mc',
    }, {
      type: 'textPos',
      name: 'وسط اليسار',
      value: 'ml',
    }, {
      type: 'textPos',
      name: 'أسفل اليمين',
      value: 'br',
    }, {
      type: 'textPos',
      name: 'أسفل الوسط',
      value: 'bc',
    }, {
      type: 'textPos',
      name: 'أسفل اليسار',
      value: 'bl',
    }, ]
  };

  constructor() { }

  getAvailableFormats() {
    return this.availableFormats;
  }
}