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
        this.musicalInstrument.push(new MidiMusicalInstrument(0));
        this.musicalInstrument.push(new MidiMusicalInstrument(21));
        this.musicalInstrument.push(new MidiMusicalInstrument(24));
        this.musicalInstrument.push(new MidiMusicalInstrument(56));
        this.musicalInstrument.push(new MidiMusicalInstrument(65));
    }

    ionViewDidLoad() {
        this.callback = this.navParams.get("callback")
    }

    public goBack(midiNumber: number){
        this.callback(midiNumber);
        this.navCtrl.pop();
    }
  
}
