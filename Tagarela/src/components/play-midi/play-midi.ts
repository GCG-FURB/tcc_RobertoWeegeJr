import { Component } from '@angular/core';
import { PlayMidiSpectrums } from '../../model/play-midi';
import { NavController, NavParams } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { MediaProvider } from '../../providers/media/media';

@Component({
  selector: 'play-midi',
  templateUrl: 'play-midi.html'
})
export class PlayMidiComponent {

    spectrum: PlayMidiSpectrums;

    constructor(public navCtrl: NavController, public navParams: NavParams, private fileProvider: FileProvider, private mediaProvider: MediaProvider) {
    }

    ionViewDidLoad() {
        this.spectrum = this.navParams.get("spectrum");
        this.playMidi();
    }

    public async playMidi(){
        let midiString = this.spectrum.midi.getBinaryString();
        await this.fileProvider.writeBinaryStringToTempArea(this.spectrum.midiId, midiString);
        await this.mediaProvider.playMidiFromTempArea(this.spectrum.midiId, this.goBack.bind(this));
        
    }

    public goBack() {
        this.navCtrl.pop();
    }


}
