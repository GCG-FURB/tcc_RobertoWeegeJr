import { Component, Input } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { VisualMidiUtil } from '../../util/visual-midi';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption } from '../../model/musical-composition';
import { ListPopoverComponent } from '../list-popover/list-popover';

@Component({
  selector: 'choice-component',
  templateUrl: 'choice.html'
})
export class ChoiceComponent {

    private visualMidi: VisualMidiUtil = new VisualMidiUtil;
    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    private backgroundSVGImageURL: string;

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
        const popover = this.popoverCtrl.create(ListPopoverComponent, 
            {
                title: 'Escolha o instrumento',
                list: this.midiChoice.musicalInstrumentsAllowed,
                callback: this.changeInstrumentMidiNumber.bind(this),
                iconFunction: this.visualMidi.getIonIconToMidiNumber,
                nameFunction: this.visualMidi.getInstrumentNameToMidiNumber,
            });
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

    getBackgroundImage(): string {
        if (!this.backgroundSVGImageURL) {
            this.generateBackgroundImageSVG();
        }
        return this.backgroundSVGImageURL;
    }

    generateBackgroundImageSVG(){
        if (this.midiChoice && this.midiChoice.midi) {
            this.backgroundSVGImageURL = encodeURI('data:image/svg+xml;utf8,' + this.midiChoice.midi.generateMidiSpectrum().getSVG());
        }
    }

}
