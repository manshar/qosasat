import { Component, ViewChild, ContentChildren, Input, Renderer, ElementRef } from '@angular/core';

@Component({
  selector: 'fit-text',
  template: `
    <div class="fit-text-container" #container [style.fontFamily]="_font">
      <div #content class="fit-text-content"
          [class.visible]="doneFitting">
        <ng-content></ng-content>
      </div>
    </div>
    `,
  styles: [`

    :host {
      position: relative;
      max-width: 100%;
      max-height: 100%;
    }

    .fit-text-container {
      max-width: 100%;
      max-height: 100%;
      position: relative;
      white-space: nowrap;
      display: block;
    }

    .fit-text-measurer .fit-text-container {
      max-width: initial;
      max-height: initial;
    }

    .fit-text-measurer {
      visibility: hidden !important;
      opacity: 0;
    }

    .fit-text-content {
      opacity: 0;
      transition: opacity .2s;
      display: inline-block;
    }

    .fit-text-content.visible,
    .fit-text-content.visible * {
      opacity: 1;
    }
  `]
})
export class FitTextComponent {
  public doneFitting: boolean = false;

  private _font: string;
  @ViewChild('container') private container;
  @ViewChild('content') private content;

  @Input('fitWidth') private fitWidth: boolean;
  @Input('fitHeight') private fitHeight: boolean;
  @Input('expectedWidth') private expectedWidth: number;
  @Input('expectedHeight') private expectedHeight: number;

  @Input('fitWidthRatio') private fitWidthRatio: number = 1;
  @Input('fitHeightRatio') private fitHeightRatio: number = 1;
  @Input()
  set font(font:string) {
    if (!this.childrenFitText) {
      this._font = font;
      return;
    }
    this.fit(true, font).then(() => {
      this._font = font;
    });
  }

  private _fitPromise: Promise<any>;
  private hasBeenFit: boolean = false;
  private maxRetryCount: number = 20;
  private retryCount: number = 0;

  @ContentChildren(FitTextComponent, {descendants: true}) private childrenFitText;
  constructor(
    private renderer: Renderer,
    private el: ElementRef) { }


  public getPositionRelativeTo(parentEl) {
    let el = this.content.nativeElement;
    const position = {top: 0, left: 0};
    while (el !== parentEl) {
      position.top += el.offsetTop;
      position.left += el.offsetLeft;
      el = el.parentElement;
    }

    return position;
  }

  public getDimensionsRelativeTo(parentEl) {
    const styles = getComputedStyle(this.content.nativeElement);
    const position = this.getPositionRelativeTo(parentEl);
    return {
      fontSize: styles.fontSize,
      fontFamily: styles.fontFamily,
      color: styles.color,
      left: position.left,
      top: position.top,
    };
  }

  public fit(optForceRefit = false, optNewFont:string = null) {
    this.doneFitting = optForceRefit ? false : this.doneFitting;

    // If it has fit-text children then call fit on these first.
    const childrenPromises = this.childrenFitText.map((fittext) => {
      if (fittext.el === this.el) {
        console.log('not a child but self resolving right away.');
        return Promise.resolve();
      }
      fittext.doneFitting = optForceRefit ? false : fittext.doneFitting;
      console.log('fitting child');
      return fittext.fitme(optForceRefit, optNewFont)
        .then(() => {
          console.log('fittext 1');
          setTimeout(
            () => {fittext.doneFitting = true}, 50);
        });
    });

    return Promise.all(childrenPromises).then(() => {
      return this.fitme(optForceRefit, optNewFont)
        .then(() => {
          console.log('fitme p');
          setTimeout(
            () => this.doneFitting = true, 50);
      });
    });
  }

  public fitme(optForceRefit, optNewFont: string = null) {
    if (!optForceRefit && this._fitPromise) {
      console.log('returning already existing fit promise');
      return this._fitPromise;
    }
    this.hasBeenFit = true;

    // Just a fallback for the first load - for some reason it's not showing.
    // setTimeout(() => {
    //   if (!this.doneFitting) {
    //     console.log('timeout 2000');
    //     // this.doneFitting = true;
    //     this.fitme(optForceRefit, optNewFont)
    //       .then(() => {
    //         setTimeout(
    //           () => this.doneFitting = true, 50);
    //       });
    //   }
    // }, 2000);

    const measurer = document.createElement('div');
    let html = this.content.nativeElement.innerHTML;
    // html = html.replace(/font-size:\s?\d+(\.\d+)?(px|em);/gi, '');
    measurer.innerHTML = html;
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
    if (optNewFont) {
      this.renderer.setElementStyle(measurer, 'font-family', optNewFont);
    }

    return this._fitPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          let expectedWidth = Math.min(
            this.el.nativeElement.offsetWidth || Infinity,
            this.expectedWidth || Infinity);
          let expectedHeight = Math.min(
              this.el.nativeElement.offsetHeight || Infinity,
              this.expectedHeight || Infinity);
          if ((expectedHeight === 0 || expectedWidth === 0) &&
              this.retryCount++ < this.maxRetryCount) {
            console.log('expectedHeight or width are 0:', this.retryCount);
            // resolve();
            return new Promise((resolve) => {
              setTimeout(() => {
                console.log('trying again');
                if (!this.el.nativeElement.parentElement) {
                  resolve(false);
                } else {
                  resolve(this.fitme(true));
                }
              }, 100);
            });
          }
          // console.log(
          //   'expectedHeight:', expectedHeight,
          //   'expectedWidth:',  expectedWidth,
          //   'minFontSize:', 0.5,
          //   'maxFontSize:', 5,
          // );

          if (!this.fitWidth && !this.fitHeight) {
            updateFontSize_(this.content.nativeElement, 4);
            updateFontSize_(measurer, 4);
            resolve();

            this.renderer.invokeElementMethod(
                this.container.nativeElement,
                'removeChild',
                [measurer]);
            console.log('not doing any fitting for this fit-text');
            return;
          }

          console.log('fitHeight:', this.fitHeight);
          console.log('fitHeightRatio:', this.fitHeightRatio);
          console.log('expectedHeight:', expectedHeight);
          console.log('fitWidthRatio:', this.fitWidthRatio);
          console.log('expectedWidth:', expectedWidth);
          const fontSize = calculateFontSize_(
              measurer,
              this.fitHeight ? expectedHeight * this.fitHeightRatio : undefined,
              this.fitWidth ? expectedWidth * this.fitWidthRatio : undefined,
              0.1, 50);
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

// TODO(mk): Emojis on a separate line with large enough font-size won't display.
// https://twitter.com/wesbos/status/650006363041497088
// Maybe check if the line is only Emoji limit the computed font-size.

function calculateFontSize_(measurer, expectedHeight, expectedWidth,
    minFontSize, maxFontSize) {
  while (maxFontSize - minFontSize > .2) {
    const mid = (minFontSize + maxFontSize) / 2.0;
    measurer.style.fontSize = mid + 'em';
    const height = measurer.offsetHeight;
    const width = measurer.offsetWidth;
    console.log(
      'measured height:', height,
      'measured width:',  width,
      'expectedHeight, expectedWidth',
      expectedHeight, expectedWidth
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
