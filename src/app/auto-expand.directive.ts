import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'ion-textarea[appAutoExpand]'
})
export class AutoExpandDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit() {
      // Add the "Cancel" button after view initialization
      const clearButton = this.renderer.createElement('ion-button');
      this.renderer.addClass(clearButton, 'ion-no-padding');
      this.renderer.addClass(clearButton, 'ion-clear');
      this.renderer.addClass(clearButton, 'clear-button');
      this.renderer.setProperty(clearButton, 'size', 'small');
      this.renderer.setProperty(clearButton, 'color', 'medium');
      this.renderer.setProperty(clearButton, 'slot', 'end');
      this.renderer.setAttribute(clearButton, 'fill', 'clear');
      this.renderer.listen(clearButton, 'click', () => {
        this.clearTextarea();
      });
  
      const icon = this.renderer.createElement('ion-icon');
      this.renderer.setProperty(icon, 'name', 'close-outline');
      this.renderer.appendChild(clearButton, icon);
  
      this.renderer.appendChild(this.el.nativeElement.shadowRoot.querySelector('.native-textarea'), clearButton);
    }
  
    private clearTextarea(): void {
      this.el.nativeElement.value = '';
      this.adjustTextareaHeight(this.el.nativeElement);
    }
  
    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
      this.adjustTextareaHeight(textArea);
    }
  
    private adjustTextareaHeight(textArea: HTMLTextAreaElement): void {
      if (textArea) {
        textArea.style.overflow = 'hidden';
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';
      }
    }
}
