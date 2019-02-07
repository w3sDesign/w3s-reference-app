/**
 * From https://angular.io/guide/attribute-directives
 */

import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  exportAs: 'w3sHighlight',
  selector: '[w3sHighlight]',
})
export class HighlightDirective {

  constructor(private el: ElementRef) {
    // el.nativeElement.style.backgroundColor = 'red';
  }
  @Input() defaultColor: string;
  @Input('w3sHighlight') highlightColor: string;


  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }


  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }


}
