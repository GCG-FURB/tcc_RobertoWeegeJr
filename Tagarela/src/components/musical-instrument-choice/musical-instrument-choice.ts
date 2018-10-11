import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VisualMidiUtil } from '../../util/visual-midi';

@Component({
  selector: 'page-musical-instrument-choice',
  templateUrl: 'musical-instrument-choice.html',
})
export class MusicalInstrumentChoiceComponent {

    private visualMidi: VisualMidiUtil = new VisualMidiUtil;
    private musicalInstruments: number[];
    private callback: Function;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.callback = this.navParams.get("callback");
        this.musicalInstruments = this.navParams.get("musicalInstruments");
    }

    public goBack(midiNumber: number){
        this.callback(midiNumber);
        this.navCtrl.pop();
    }
  
}
