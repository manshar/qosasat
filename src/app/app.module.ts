import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import { Autosize } from 'angular2-autosize';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { ClipComponent } from './clip/clip.component';
import { ClipsTabComponent, ClipsTabsComponent } from './shared/clips-tabs';
import { FitTextComponent } from './clip/fit-text.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { SingleStepEditorComponent } from './single-step-editor';
import { HomeComponent } from './home';
// import { AboutComponent } from './about';
import { ExportComponent } from './export';
import { CreditsComponent } from './credits';
import { NoContentComponent } from './no-content';
import { ClipsDirectExporterComponent } from './clips-direct-exporter';
import { XLargeDirective } from './home/x-large';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { ColorPickerModule } from './color-picker/color-picker.module';

import { CarbonUpUpModule } from './carbon-upup/carbon-upup.module';
import { ClipsSelectorModule } from './shared/clips-selector/clips-selector.module';
import { ClipsPhotosModule } from './shared/clips-photos-selector/clips-photos.module';
import {
  ClipsFontsModule,
} from './shared/clips-fonts-selector/clips-fonts.module';
import { ClipsFormatsModule } from './shared/clips-formats-selector/clips-formats.module';
import { ClipsSizesModule } from './shared/clips-sizes-selector/clips-sizes.module';
import { YorwaQuotesModule } from './shared/yorwa-quotes-selector/yorwa-quotes.module';
import {
  ClipsExportManagerModule,
} from './shared/clips-export-manager/clips-export-manager.module';

import '../styles/styles.scss';
import '../styles/headings.css';

import 'hammerjs';
import 'hammer-timejs';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ClipsDirectExporterComponent,
    SingleStepEditorComponent,
    CreditsComponent,
    ClipComponent,
    ClipsTabComponent,
    ClipsTabsComponent,
    FitTextComponent,
    NoContentComponent,
    Autosize,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    HttpModule,
    InfiniteScrollModule,
    ColorPickerModule,
    CarbonUpUpModule,
    ClipsPhotosModule,
    ClipsFontsModule,
    ClipsSelectorModule,
    ClipsFormatsModule,
    ClipsSizesModule,
    ClipsExportManagerModule,
    YorwaQuotesModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues  = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
