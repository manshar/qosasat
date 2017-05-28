import { Component, ViewChild, ContentChildren, Input, Renderer, ElementRef } from '@angular/core';

@Component({
  selector: 'fit-text',
  template: `
    <div class="fit-text-container" #container>
      <div #content class="fit-text-content">
        <ng-content></ng-content>
      </div>
    </div>
    `,
  styles: [`

    :host {
      // position: relative;
    }
    .fit-text-container {
      position: relative;
      white-space: nowrap;
      display: block;
    }
  `]
})
export class FitTextComponent {
  _measurer:HTMLElement;
  static _counter = 1;
  @ViewChild('container') container;
  @ViewChild('content') content;

  @Input('fitWidth') fitWidth:boolean;
  @Input('fitHeight') fitHeight:boolean;

  @Input('fitWidthRatio') fitWidthRatio:number = 1;
  @Input('fitHeightRatio') fitHeightRatio:number = 1;

  _fitPromise:Promise<any>;

  hasBeenFit:boolean = false;

  @ContentChildren(FitTextComponent, {descendants: true}) childrenFitText;
  constructor(
    private renderer:Renderer,
    private el:ElementRef) { }

  public fit(optForceRefit = false) {
    // If it has fit-text children then call fit on these first.
    const childrenPromises = this.childrenFitText.map(fittext => {
      if (fittext.el === this.el) {
        console.log('not a child but self resolving right away.');
        return Promise.resolve();
      }
      return fittext.fitme(optForceRefit);
    });

    if (optForceRefit || !this.hasBeenFit) {
      return Promise.all(childrenPromises).then(() => {
        this.fitme(optForceRefit)
      });
    }
    return Promise.resolve();
  }

  public fitme(optForceRefit) {
    if (!optForceRefit && this._fitPromise) {
      console.log('returning already existing fit promise');
      return this._fitPromise;
    }
    this.hasBeenFit = true;

    const measurer = document.createElement('div');
    measurer.innerHTML = this.content.nativeElement.innerHTML;
    measurer.classList.add('fit-text-measurer');

    this.renderer.invokeElementMethod(
        this.container.nativeElement,
        'appendChild',
        [measurer]);
    this.renderer.setElementStyle(measurer, 'position', 'absolute');
    this.renderer.setElementStyle(measurer, 'top', '0');
    this.renderer.setElementStyle(measurer, 'left', '0');
    this.renderer.setElementStyle(measurer, 'zIndex', '1');
    this.renderer.setElementStyle(measurer, 'visibility', 'hidden');

    return this._fitPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          let expectedWidth = this.el.nativeElement.offsetWidth;
          let expectedHeight = this.el.nativeElement.offsetHeight;
          if (expectedHeight === 0 || expectedWidth === 0) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(this.fitme(true));
              }, 100);
            });
          }
          console.log(
            'expectedHeight:', expectedHeight,
            'expectedWidth:',  expectedWidth,
            'minFontSize:', 0.5,
            'maxFontSize:', 5,
          );

          if (!this.fitWidth && !this.fitHeight) {
            updateFontSize_(this.content.nativeElement, 2);
            updateFontSize_(measurer, 2);
            resolve();

          this.renderer.invokeElementMethod(
              this.container.nativeElement,
              'removeChild',
              [measurer]);
            console.log('not doing any fitting for this fit-text');
            return;
          }

          if (!this.fitWidth) {
            expectedWidth = undefined;
          }
          if (!this.fitHeight) {
            expectedHeight = undefined;
          }

          const fontSize = calculateFontSize_(
              measurer,
              expectedHeight * this.fitHeightRatio,
              expectedWidth * this.fitWidthRatio,
              0.5, 10);
          requestAnimationFrame(() => {
            updateFontSize_(this.content.nativeElement, fontSize);
            this.renderer.invokeElementMethod(
                this.container.nativeElement,
                'removeChild',
                [measurer]);
            resolve();
          });
          console.log('calculated fontSize: ', fontSize);
        });
      }, 50);
    });
  }
}

function calculateFontSize_(measurer, expectedHeight, expectedWidth,
    minFontSize, maxFontSize) {
  while (maxFontSize - minFontSize > 0.2) {
    const mid = (minFontSize + maxFontSize) / 2.0;
    measurer.style.fontSize = mid + 'em';
    const height = measurer.offsetHeight;
    const width = measurer.offsetWidth;
    console.log(
      measurer,
      'measured height:', height,
      'measured width:',  width,
    )
    if ((expectedHeight && height > expectedHeight) ||
        (expectedWidth && width > expectedWidth)) {
      maxFontSize = mid;
    } else {
      minFontSize = mid;
    }
  }
  return minFontSize;
};

function updateFontSize_(element, fontSize) {
  element.style.fontSize = fontSize + 'em';
}
