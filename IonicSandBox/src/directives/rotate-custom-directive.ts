import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
 
@Directive({
    selector: '[rotateCustom]'
})
export class RotateCustomeDirective {
    @Output() angleChange = new EventEmitter<any>();
 
    //although rotatestart is not required here, but we are keeping it here for reference purpose
    /*
         @HostListener('rotatestart', ['$event']) protected onRotateStart(event) {
            event.preventDefault();
            //put your code 
        }
    */
 
    @HostListener('rotatemove', ['$event']) protected onRotateMove(event) {
        event.preventDefault();
        this.angleChange.emit({ angle: event.angle });
    }
}