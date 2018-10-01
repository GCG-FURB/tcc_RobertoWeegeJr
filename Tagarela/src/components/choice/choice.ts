import { Component } from '@angular/core';

@Component({
  selector: 'choice-component',
  templateUrl: 'choice.html'
})
export class ChoiceComponent {

  text: string;

  constructor() {
    console.log('Hello ChoiceComponent Component');
    this.text = 'Hello World';
  }

}
