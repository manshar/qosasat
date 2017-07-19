import { ActivatedRoute } from '@angular/router';
/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Renderer,
} from '@angular/core';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <header class="site-header" style="display: none">
      <nav>
        <a [href]="'/about' + (embeddedOrigin ? ('?utm_source=' + embeddedOrigin +'&utm_medium=embedded-clips') : '')" [target]="(embedded ? '_blank' : '_self')">
          عن قصاصات
        </a>
      </nav>
      <div class="logo">
        <i></i>
        <a [routerLink]="['/']" [queryParams]="{embedded: embedded ? 1 : 0, embeddedOrigin: embeddedOrigin}">
          قُصَاصَات
        </a>
        <span class="tagline">
            من أدوات

          <a target="_blank" href="https://www.manshar.com?utm_source=manshar-clips">
            منشر
          </a>
        </span>
      </div>
    </header>

    <main [class.embedded]="embedded">
      <router-outlet (deactivate)="onDeactivate()"></router-outlet>
    </main>

    <footer style="display: none">
      <p>
        من أصدقائكم القائمين على
        <a target="blank" href="https://www.manshar.com?utm_source=manshar-clips">
        منشر
        </a>
        .
      </p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor(
    public route: ActivatedRoute,
    public appState: AppState,
    private renderer:Renderer,
  ) {}

  onDeactivate() {
    this.renderer.setElementProperty(document.body, "scrollTop", 0);
  }

  embedded:boolean = false;
  embeddedOrigin:string = '';
  public ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.embedded = params['embedded'] == '1';
        this.embeddedOrigin = params['embeddedOrigin'];
      });
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
