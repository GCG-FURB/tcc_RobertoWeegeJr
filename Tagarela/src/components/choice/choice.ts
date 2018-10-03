import { Component } from '@angular/core';
import { MusicalInstrumentChoicePage } from '../../pages/musical-instrument-choice/musical-instrument-choice';
import { NavController } from 'ionic-angular';
import { VisualMidi } from '../../util/visual-midi';

@Component({
  selector: 'choice-component',
  templateUrl: 'choice.html'
})
export class ChoiceComponent {

    private _instrumentMidiNumber: number = 1;
    private visualMidi: VisualMidi = new VisualMidi;

    constructor(public navCtrl: NavController) {
    }

    get instrumentMidiNumber(): number {
        return this._instrumentMidiNumber;
    }

    set instrumentMidiNumber(instrumentMidiNumber: number) {
        this._instrumentMidiNumber = instrumentMidiNumber;
    }

    public goToMusicalInstrumentChoice(){
        this.navCtrl.push(MusicalInstrumentChoicePage, {
            callback: this.changeInstrumentMidiNumber.bind(this)
        });
    }

    public changeInstrumentMidiNumber(instrumentMidiNumber: number) {
        console.log('aquii')
        console.log(instrumentMidiNumber)
        this.instrumentMidiNumber = instrumentMidiNumber
    }
 

}
