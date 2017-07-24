import { Injectable } from '@angular/core';
import * as WebFont from 'webfontloader/webfontloader';
import ArFontsConfig from './data/ar-fonts.json';

@Injectable()
// export class FontLoader {
export class ClipsFontsService {
  fontsStatus = {
    'barabics': 'active',
  };
  loadedFonts:Array<String> = [];
  failedFonts:Array<String> = [];
  loadingFonts:Array<String> = [];
  loadedConfigs = {};

  _loadConfig(config) {
    return new Promise((resolve, reject) => {
      if (this.loadedConfigs[config]) {
        resolve(this.loadedConfigs[config]);
        return this.loadedConfigs[config];
      }
      // return System.import('./data/' + config)
        // .then(json => {
      this.loadedConfigs[config] = ArFontsConfig;
      this.loadingFonts.concat(ArFontsConfig['fonts']);
      resolve(ArFontsConfig);
      return ArFontsConfig;
        // });
    });
  }

  loadConfig(config, optOnlyFonts = null) {
    return this._loadConfig(config)
      .then(json => {
        return this.load(optOnlyFonts || json['fonts'], json['urlPrefix']);
      });
  }

  load(fonts, urlPrefix) {
    const fontsToLoad = fonts.filter(font => {
      return (this.fontsStatus[font] !== 'loading' &&
        this.fontsStatus[font] !== 'active');
    })
    var WebFontConfig = {
      fontloading: (name) => {
        // console.log('font loading: ', name);
        this.loadingFonts.push(name);
        this.fontsStatus[name] = 'loading';
      },
      fontactive: (name) => {
        // console.log('font active: ', name);
        this.loadingFonts.splice(this.loadingFonts.indexOf(name), 1);
        this.loadedFonts.push(name);
        this.fontsStatus[name] = 'active';
        this.notifyListeners_({font: name});
      },
      fontinactive: (name) => {
        // console.log('font inactive: ', name);
        this.loadingFonts.splice(this.loadingFonts.indexOf(name), 1);
        this.failedFonts.push(name);
        this.fontsStatus[name] = 'inactive';
      },
      custom: {
        families: fontsToLoad,
        urls: [urlPrefix + fonts.join(',')],
      },
      timeout: 30000,
    };

    // WebFont
    if (fontsToLoad.length > 0) {
      WebFont.load(WebFontConfig);
    }
  }

  _listeners:Array<Function> = [];

  onFontLoad(callback) {
    this._listeners.push(callback);
  }

  notifyListeners_(data) {
    this._listeners.forEach(handler => {
      handler(data);
    })
  }
}