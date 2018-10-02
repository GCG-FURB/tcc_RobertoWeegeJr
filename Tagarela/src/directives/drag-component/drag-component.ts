import { Directive, Input, ElementRef, Renderer } from '@angular/core';
import { DomController } from 'ionic-angular';
import  Draggabilly from 'draggabilly';
/**
 * Generated class for the DragComponentDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[drag-component]' // Attribute selector
})
export class DragComponentDirective {

  @Input('elementId') elementId: string;
  @Input('scrollId') scrollId: string;

  @Input('startLeft') startLeft: any;
  @Input('startTop') startTop: any;

  constructor(public element: ElementRef, public renderer: Renderer, public domCtrl: DomController) {
  }

  ngAfterViewInit() {

      /*this.renderer.setElementStyle(this.element.nativeElement, 'position', 'absolute');
      this.renderer.setElementStyle(this.element.nativeElement, 'left', this.startLeft + 'px');
      this.renderer.setElementStyle(this.element.nativeElement, 'top', this.startTop + 'px');

      let hammer = new window['Hammer'](this.element.nativeElement);
      hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_ALL });

      hammer.on('pan', (ev) => {
        this.handlePan(ev);
      });*/
      
      let draggie = new Draggabilly ( document.getElementById(this.elementId), {});

      let scrollDiv = document.getElementById(this.scrollId)

      

      draggie.on();


      

  }

  handlePan(ev){

      let newLeft = ev.center.x;
      let newTop = ev.center.y;

      this.domCtrl.write(() => {
          this.renderer.setElementStyle(this.element.nativeElement, 'left', newLeft + 'px');
          this.renderer.setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
      });

  }

}
