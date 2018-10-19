import { Component } from '@angular/core';
import { PlayMidiSpectrums } from '../../model/play-midi';
import { NavController, NavParams } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { MediaProvider } from '../../providers/media/media';
import { MidiControl } from '../../control/midi-control';

@Component({
  selector: 'play-midi',
  templateUrl: 'play-midi.html'
})
export class PlayMidiComponent {

    spectrum: PlayMidiSpectrums;

    midiControl: MidiControl;

    constructor(public navCtrl: NavController, public navParams: NavParams, private fileProvider: FileProvider, private mediaProvider: MediaProvider) {
    }

    ionViewDidLoad() {
        this.midiControl = new MidiControl();
        this.spectrum = this.navParams.get("spectrum");
        this.playMidi();
    }

    public async playMidi(){
        let midiString = this.midiControl.getBinaryString(this.spectrum.midi);
        await this.fileProvider.writeBinaryStringToTempArea(this.spectrum.midiId, midiString);
        await this.mediaProvider.playMidiFromTempArea(this.spectrum.midiId, this.goBack.bind(this));
    }

    public goBack() {
        this.navCtrl.pop();
    }


}
