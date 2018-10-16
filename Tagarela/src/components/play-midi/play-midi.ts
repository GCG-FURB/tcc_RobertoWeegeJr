import { Component } from '@angular/core';
import { PlayMidiSpectrums } from '../../model/play-midi';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';

/**
 * Generated class for the PlayMidiComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'play-midi',
  templateUrl: 'play-midi.html'
})
export class PlayMidiComponent {

    spectrum: PlayMidiSpectrums;
    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    constructor(public navCtrl: NavController, public navParams: NavParams, private file: File, private media: Media) {
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }

    ionViewDidLoad() {
        this.spectrum = this.navParams.get("spectrum");
        this.playMidi();
    }

    public async playMidi(){
        let midiString = this.spectrum.midi.getBinaryString();
        await this.fileUtil.writeBinaryStringToTempArea(this.spectrum.midiId, midiString);
        await this.mediaUtil.playMidiFromTempArea(this.spectrum.midiId, this.goBack.bind(this));
        
    }

    public goBack() {
        this.navCtrl.pop();
    }


}
