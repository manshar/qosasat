import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'credits',
  styleUrls: ['./credits.component.css'],
  templateUrl: './credits.component.html'
})
export class CreditsComponent implements AfterViewInit, OnDestroy {
  constructor(private elementRef: ElementRef,
              private renderer: Renderer) {}

  public ngOnDestroy() {
    const crispClientEl = this.renderer.selectRootElement('.crisp-client');
    this.renderer.invokeElementMethod(
        window.document.body,
      'removeChild', [crispClientEl]);
  }

  public ngAfterViewInit() {
    window['$crisp'] = [];
    window['CRISP_WEBSITE_ID'] = 'd82dda61-3eba-4268-a3b5-e5b24908ad45';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://client.crisp.chat/l.js';
    this.renderer.invokeElementMethod(
        this.elementRef.nativeElement,
      'appendChild', [script]);
  }

}
