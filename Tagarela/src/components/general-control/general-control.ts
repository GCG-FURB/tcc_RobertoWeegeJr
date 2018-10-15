import { Component, Input } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { VisualMidiUtil } from '../../util/visual-midi';
import { PopoverController } from 'ionic-angular';
import { ListPopoverComponent } from '../list-popover/list-popover';
import { MidiConstants } from '../../control/midi';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';

@Component({
    selector: 'general-control',
    templateUrl: 'general-control.html'
})
export class GeneralControlComponent {
    
    @Input()
    private compositionControl: MusicalCompositionControl;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;
    private visualMidi: VisualMidiUtil;

    constructor(private file: File, private media: Media, public popoverCtrl: PopoverController) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media);
        this.visualMidi = new VisualMidiUtil();
    }

    teste() {
        this.compositionControl.generateCompositionMidi();
        this.playMidi();
    }

    public playMidi() {
        let midiString = this.compositionControl.composition.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.compositionControl.composition.midiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.compositionControl.composition.midiId);
            });
    }

    public changeKeySignature(){
        const popover = this.popoverCtrl.create(ListPopoverComponent, 
            {
                title: 'Escolha a Armadura de Clave',
                list: MidiConstants.KEY_SIGNATURE_CONVERSION_VECTOR,
                callback: this.setKeySignature.bind(this),
                iconFunction: this.visualMidi.getIonIconToMayorKeySignatureNumber,
                nameFunction: this.visualMidi.getInstrumentNameToMayorKeySignatureNumber
            });
        popover.present();
    }

    public setKeySignature(keySignature: number) {
        this.compositionControl.composition.keySignature = keySignature;
    }


    public changeTempo(){
        const popover = this.popoverCtrl.create(SlidePopoverComponent, 
            {
                callback: this.setTempo.bind(this),
                color: 'danger',
                description: 'Tempo',
                value: this.compositionControl.composition.tempo,
                minRangeValue: this.compositionControl.composition.minTempo,
                maxRangeValue: this.compositionControl.composition.maxTempo,
                stepRangeValue: this.compositionControl.composition.stepTempo,
                snapsRange: false
            });
        popover.present();
    }

    public setTempo(tempo: number) {
        this.compositionControl.composition.tempo = tempo;
    }

}
