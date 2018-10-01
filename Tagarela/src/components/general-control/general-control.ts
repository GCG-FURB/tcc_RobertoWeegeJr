import { Component } from '@angular/core';

/**
 * Generated class for the GeneralControlComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'general-control',
    templateUrl: 'general-control.html'
})
export class GeneralControlComponent {

    //Tone control
    private toneIndex: number = 0;
    private TONE_VALUES: string[] = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

    //Tempo control
    private MIN_TEMPO_VALUE: number = 40;
    private MAX_TEMPO_VALUE: number = 200;
    private tempoValue: number = 60;

    constructor() {}

}
