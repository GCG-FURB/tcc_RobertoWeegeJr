import { Component } from '@angular/core';

/**
 * Generated class for the VolumeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'volume-component',
  templateUrl: 'volume.html'
})
export class VolumeComponent {

  text: string;

  constructor() {
    console.log('Hello VolumeComponent Component');
    this.text = 'Hello World';
  }

}
