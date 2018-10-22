import { Component, Input } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { ListPopoverComponent } from '../list-popover/list-popover';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';
import { GenericComponent } from '../../control/generic-component';
import { MidiSpectrum } from '../../model/midi-spectrum';
import { MidiSpectrumSvgProvider } from '../../providers/midi-spectrum-svg/midi-spectrum-svg';
import { Midi } from '../../model/midi';
import { FileProvider } from '../../providers/file/file';

@Component({
    selector: 'general-control',
    templateUrl: 'general-control.html'
})
export class GeneralControlComponent extends GenericComponent {
    
    private _compositionControl: MusicalCompositionControl;

    constructor(private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private visualMidiProvider: VisualMidiProvider,
                private midiSpectrumSvgProvider: MidiSpectrumSvgProvider,
                private fileProvider: FileProvider) {        

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl);

    }
   
    public get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }

    @Input() 
    public set compositionControl(value: MusicalCompositionControl) {
        this._compositionControl = value;
    }

    private playMidi() {
        try {
            this.compositionControl.applyGeneralChanges();
            this.startPopover(
                PlayMidiComponent, 
                {
                    spectrum: this.getSvgImageImage(),
                    midi: this.compositionControl.composition.midi,
                    midiId: this.compositionControl.composition.midiId
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getSvgImageImage(): string {
        let spectrums: MidiSpectrum[][] = [];
        let musicalInstruments: number[][] = [];
        let minNotes: number[] = [];
        let maxNotes: number[] = [];
    
        for (let line of this.compositionControl.composition.lines) {

            let lineSpectrums: MidiSpectrum[] = []; 
            let lineMusicalInstruments: number[] = [];

            for (let option of line.options) {
                lineSpectrums.push(option.spectrum);
                lineMusicalInstruments.push(option.musicalInstrument);
            }

            minNotes.push(line.getMinSpectrumNote())
            maxNotes.push(line.getMaxSpectrumNote())
            spectrums.push(lineSpectrums);
            musicalInstruments.push(lineMusicalInstruments);

        }
        return this.midiSpectrumSvgProvider.concatenateSpectrums(spectrums, musicalInstruments, minNotes, maxNotes);
    }

    private changeKeySignature(){
        try {
            this.startPopover(
                ListPopoverComponent, 
                {
                    title: 'Armadura de Clave',
                    list: Midi.KEY_SIGNATURES_ARRAY,
                    callback: this.setKeySignature.bind(this),
                    iconFunction: this.visualMidiProvider.getIonIconToMayorKeySignatureNumber,
                    nameFunction: this.visualMidiProvider.getInstrumentNameToMayorKeySignatureNumber
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private setKeySignature(keySignature: number) {
        try {
            this.compositionControl.composition.keySignature = keySignature;
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private changeTempo(){
        try {
            this.startPopover(
                SlidePopoverComponent, 
                {
                    callback: this.setTempo.bind(this),
                    color: 'danger',
                    description: 'Tempo',
                    value: this.compositionControl.composition.tempo,
                    minRangeValue: this.compositionControl.composition.minTempo,
                    maxRangeValue: this.compositionControl.composition.maxTempo,
                    stepRangeValue: this.compositionControl.composition.stepTempo,
                    snapsRange: false
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private setTempo(tempo: number) {
        try {
            this.compositionControl.composition.tempo = tempo;
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private undo() {
        try {
            this.compositionControl.undoChoice();
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private compositionHasStarted(): boolean{
        try {
            return this.compositionControl.compositionHasStarted();
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private compositionHasEnded(): boolean{
        try {
            return this.compositionControl.compositionHasEnded();
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private downloadAndOpenPdf() {
        try {
            this.fileProvider.file.copyFile(this.fileProvider.tempAreaDir, this.compositionControl.composition.midiId + '.mid', this.fileProvider.file.externalRootDirectory + 'Download', 'copied3.mid')
            .then(() => {alert('foi')
        })
            .catch((e) => {alert(JSON.stringify(e))})
        
        } catch (e) {
            this.errorHandler(e)
        }
        
    }

}
