import { Component, Input } from '@angular/core';
import { MusicalInstrumentChoicePage } from '../../pages/musical-instrument-choice/musical-instrument-choice';
import { NavController, PopoverController } from 'ionic-angular';
import { VisualMidi } from '../../util/visual-midi';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption } from '../../model/musical-composition';

@Component({
  selector: 'choice-component',
  templateUrl: 'choice.html'
})
export class ChoiceComponent {

    private visualMidi: VisualMidi = new VisualMidi;
    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    @Input()
    private composition: MusicalCompositionControl;
    
    @Input()
    private midiChoice: MusicalCompositionOption;

    @Input()
    private toChoice: boolean;


    constructor(public navCtrl: NavController, private file: File, private media: Media, public popoverCtrl: PopoverController) {
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }

    public goToMusicalInstrumentChoice(){
        const popover = this.popoverCtrl.create(MusicalInstrumentChoicePage, {callback: this.changeInstrumentMidiNumber.bind(this)});
        popover.present();
    }

    
    public changeInstrumentMidiNumber(instrumentMidiNumber: number) {
        this.midiChoice.musicalInstrument = instrumentMidiNumber
    }
    

    public playMidi() {
        this.composition.applyOptionChanges(this.midiChoice);
        let midiString = this.midiChoice.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.midiChoice.midiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.midiChoice.midiId);
            });
    }

    public teste() {
        this.composition.applyChoice(this.midiChoice);
    }
 
}
