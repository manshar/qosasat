import { Injectable } from '@angular/core';
import * as WebFont from 'webfontloader/webfontloader';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {

  public _state: InternalStateType = { };

  /**
   * Already return a clone of the current state.
   */
  public get state() {
    return this._state = this._clone(this._state);
  }
  /**
   * Never allow mutation
   */
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    /**
     * Use our state getter for the clone.
     */
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    /**
     * Internally mutate our state.
     */
    return this._state[prop] = value;
  }

  private _clone(object: InternalStateType) {
    /**
     * Simple object clone.
     */
    return JSON.parse(JSON.stringify( object ));
  }
}


export class FontLoader {
  static loadedFonts:Array<String> = [];
  static failedFonts:Array<String> = [];
  static loadingFonts:Array<String> = [];
  static loadedConfigs = {};

  static _loadConfig(config) {
    return new Promise((resolve, reject) => {
      if (this.loadedConfigs[config]) {
        resolve(this.loadedConfigs[config]);
        return this.loadedConfigs[config];
      }
      return System.import('../assets/data/' + config)
        .then(json => {
          this.loadedConfigs[config] = json;
          this.loadingFonts.concat(json['fonts']);
          resolve(json);
          return json;
        });
    });
  }

  static loadConfig(config, optOnlyFonts = null) {
    return this._loadConfig(config)
      .then(json => {
        return this.load(optOnlyFonts || json['fonts'], json['urlPrefix']);
      });
  }

  static load(fonts, urlPrefix) {
    var WebFontConfig = {
      fontloading: (name) => {
        console.log('font loading: ', name);
        this.loadingFonts.push(name);
      },
      fontactive: (name) => {
        console.log('font active: ', name);
        this.loadingFonts.splice(this.loadingFonts.indexOf(name), 1);
        this.loadedFonts.push(name);
      },
      fontinactive: (name) => {
        console.log('font inactive: ', name);
        this.loadingFonts.splice(this.loadingFonts.indexOf(name), 1);
        this.failedFonts.push(name);
      },
      custom: {
        families: fonts,
        urls: [urlPrefix + fonts.join(',')]
      }
    };

    // WebFont
    if (fonts.length > 0) {
      WebFont.load(WebFontConfig);
    }
  }
}
