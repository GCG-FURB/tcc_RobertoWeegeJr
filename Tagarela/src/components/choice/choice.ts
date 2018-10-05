import { Component, Input } from '@angular/core';
import { MusicalInstrumentChoicePage } from '../../pages/musical-instrument-choice/musical-instrument-choice';
import { NavController } from 'ionic-angular';
import { VisualMidi } from '../../util/visual-midi';
import { MusicalCompositionOption, Composition, MusicalCompositionStep } from '../../util/composition';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';

@Component({
  selector: 'choice-component',
  templateUrl: 'choice.html'
})
export class ChoiceComponent {

    private _instrumentMidiNumber: number = 1;
    private visualMidi: VisualMidi = new VisualMidi;
    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    @Input()
    private midiChoice: MusicalCompositionOption;

    @Input()
    private composition: Composition;

    @Input()
    private compositionStepIndex: number;

    @Input()
    private compositionStep: MusicalCompositionStep;

    constructor(public navCtrl: NavController, private file: File, private media: Media) {
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
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
        this.instrumentMidiNumber = instrumentMidiNumber
    }

    public playMidi() {
        let midiString = this.midiChoice.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.midiChoice.uId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.midiChoice.uId);
            });
    }

    public teste() {
        if (this.composition.compositionLines.length <= this.compositionStepIndex) {
            this.composition.addCompositionLine(this.compositionStep.name);
        }
        this.composition.addCompositionOption(this.compositionStepIndex, this.midiChoice);
        this.compositionStepIndex++;
    }
 
}
