import { Component, Input } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { PopoverController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ListPopoverComponent } from '../list-popover/list-popover';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';
import { GenericComponent } from '../../control/generic-component';
import { MidiSpectrumSvgProvider } from '../../providers/midi-spectrum-svg/midi-spectrum-svg';
import { DownloadMidiComponent } from '../download-midi/download-midi';
import { CompositionMidiSpectrumsData } from '../../model/midi-spectrum';
import { Device } from '@ionic-native/device';

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
                private toastCtrl: ToastController,
                private dev: Device) {

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl,
              dev);

    }
   
    get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }

    @Input() 
    set compositionControl(compositionControl: MusicalCompositionControl) {
        this._compositionControl = compositionControl;
    }

    private playMidi(): void {
        try {
            this.compositionControl.applyGeneralChanges();
            this.startPopover(
                PlayMidiComponent, 
                {
                    spectrum: this.getSVGMidiSpectrum(),
                    midi: this.compositionControl.composition.midi,
                    midiId: this.compositionControl.composition.midiId
                },
                {   
                    cssClass: 'custom-popover',
                    enableBackdropDismiss: false
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getSVGMidiSpectrum(): string {
        let compositionMidiSpectrumsData: CompositionMidiSpectrumsData = this.compositionControl.getCompositionMidiSpectrums();
        return this.midiSpectrumSvgProvider.concatenateSpectrums(compositionMidiSpectrumsData.spectrums, 
                                                                 compositionMidiSpectrumsData.musicalInstruments, 
                                                                 this.compositionControl.composition.midi.getTimeDivisionMetric(), 
                                                                 compositionMidiSpectrumsData.minNotes, 
                                                                 compositionMidiSpectrumsData.maxNotes);
    }

    private changeKeySignature(): void {
        try {
            this.startPopover(
                ListPopoverComponent, 
                {
                    title: 'Armadura de Clave',
                    list: this.compositionControl.composition.keySignaturesAllowed,
                    callback: this.setKeySignature.bind(this),
                    iconFunction: this.visualMidiProvider.getIonIconToKeySignatureNumber,
                    nameFunction: this.getKeySignatureName(this.compositionControl.composition.mode)
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getKeySignatureName(mode: number): Function {
        return (keySignatureNumber: number): string => {
            return this.visualMidiProvider.getKeySignatureName(keySignatureNumber, mode);
        }
    }

    private setKeySignature(keySignature: number): void {
        try {
            this.compositionControl.composition.keySignature = keySignature;
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private changeTempo(): void {
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

    private setTempo(tempo: number): void {
        try {
            this.compositionControl.composition.tempo = tempo;
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private undo(): void {
        try {
            this.compositionControl.undoChoice();
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private compositionHasStarted(): boolean {
        try {
            return this.compositionControl.compositionHasStarted();
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private compositionHasEnded(): boolean {
        try {
            return this.compositionControl.compositionHasEnded();
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private downloadComposition(): void {
        try {
            this.compositionControl.applyGeneralChanges();
            this.startPopover(
                DownloadMidiComponent,
                {
                    midi: this.compositionControl.composition.midi
                }
            )
        } catch (e) {
            this.errorHandler(e)
        }
    }

}
