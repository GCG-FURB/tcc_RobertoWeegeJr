import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MidiMusicalInstrument } from '../../util/midi-models';
import { VisualMidi } from '../../util/visual-midi';

@Component({
  selector: 'page-musical-instrument-choice',
  templateUrl: 'musical-instrument-choice.html',
})
export class MusicalInstrumentChoicePage {

    private visualMidi: VisualMidi = new VisualMidi;
    private musicalInstrument: MidiMusicalInstrument[];
    private callback: Function;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.musicalInstrument = [];
        this.musicalInstrument.push(new MidiMusicalInstrument(1));
        this.musicalInstrument.push(new MidiMusicalInstrument(2));
        this.musicalInstrument.push(new MidiMusicalInstrument(3));
        this.musicalInstrument.push(new MidiMusicalInstrument(4));

    }

    ionViewDidLoad() {
        this.callback = this.navParams.get("callback")
    }

    public goBack(midiNumber: number){
        this.callback(midiNumber);
        this.navCtrl.pop();
    }
  
}
