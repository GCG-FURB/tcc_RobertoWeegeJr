import { Component } from '@angular/core';

/**
 * Generated class for the CompositionControlComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent {

  text: string;

  constructor() {
    console.log('Hello CompositionControlComponent Component');
    this.text = 'Hello World';
  }

}
