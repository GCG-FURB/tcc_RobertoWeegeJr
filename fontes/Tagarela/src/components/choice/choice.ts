import { Component, Input } from '@angular/core';
import { PopoverController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption } from '../../model/musical-composition';
import { ListPopoverComponent } from '../list-popover/list-popover';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';
import { GenericComponent } from '../../control/generic-component';
import { MidiSpectrumSvgProvider } from '../../providers/midi-spectrum-svg/midi-spectrum-svg';
import { CompositionControlComponent } from '../composition-control/composition-control';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'choice-component',
  templateUrl: 'choice.html'
})
export class ChoiceComponent extends GenericComponent{

    //inputs
    private _composition: MusicalCompositionControl;
    private _midiChoice: MusicalCompositionOption;
    private _toChoice: boolean;
    private _minNote: number;
    private _maxNote: number;

    //local
    private _backgroundSVGImageURL: string;

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
    
    get composition(): MusicalCompositionControl {
        return this._composition;
    }
    
    @Input()
    set composition(composition: MusicalCompositionControl) {
        this._composition = composition;
    }

    get midiChoice(): MusicalCompositionOption {
        return this._midiChoice;
    }
    
    @Input()
    set midiChoice(midiChoice: MusicalCompositionOption) {
        this._midiChoice = midiChoice;
    }
    
    get toChoice(): boolean {
        return this._toChoice;
    }
    
    @Input()
    set toChoice(toChoice: boolean) {
        this._toChoice = toChoice;
    }

    get minNote(): number {
        return this._minNote;
    }

    @Input()
    set minNote(minNote: number) {
        if (this._minNote != minNote)
            this.backgroundSVGImageURL = null;
        this._minNote = minNote;
    }
    
    get maxNote(): number {
        return this._maxNote;
    }

    @Input()
    set maxNote(maxNote: number) {
        if (this._maxNote != maxNote)
            this.backgroundSVGImageURL = null;
        this._maxNote = maxNote;
    }

    get backgroundSVGImageURL(): string {
        return this._backgroundSVGImageURL;
    }

    set backgroundSVGImageURL(backgroundSVGImageURL: string) {
        this._backgroundSVGImageURL = backgroundSVGImageURL;
    }

    private getBackgroundImage(): string {
        try {
            if (!this.backgroundSVGImageURL) 
                this.generateBackgroundImageSVG();
            return this.backgroundSVGImageURL;
        } catch (e) {
            this.errorHandler(e);
        }
    }
        
    private generateBackgroundImageSVG(): void {
        if (this.midiChoice && this.midiChoice.midi) {
            this.backgroundSVGImageURL = this.midiSpectrumSvgProvider
                                             .getEncodedSVGSpectrum(this.midiChoice.spectrum, 
                                                                    this.midiChoice.musicalInstrument,
                                                                    this.midiChoice.midi.getTimeDivisionMetric(),
                                                                    this.minNote,
                                                                    this.maxNote); 
        }
    }

    private getColor(): string {
        try {
            return this.visualMidiProvider.getInstrumentType(this.midiChoice.musicalInstrument);
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private getWidthSize(): number {
        if (this.midiChoice && this.midiChoice.midi) {
            return this.midiChoice.midi.getDeltaTimeSum(CompositionControlComponent.MIDI_TRACK) / this.midiChoice.midi.getTimeDivisionMetric() * CompositionControlComponent.SPECTRUM_SIZE_OF_QUARTER_NOTE;
        }
        return 0;
    }

    private playMidi(): void {
        try {
            this.composition.applyOptionChanges(this.midiChoice);
            this.startPopover(
                PlayMidiComponent, 
                {
                    spectrum: this.getBackgroundImage(),
                    midi: this.midiChoice.midi,
                    midiId: this.midiChoice.midiId
                },
                {   
                    cssClass: 'custom-popover',
                    enableBackdropDismiss: false
                }
            );
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private applyChoice(): void {
        try {
            this.composition.applyChoice(this.midiChoice);
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private goToMusicalInstrumentChoice(): void {
        try {
            this.startPopover(
                ListPopoverComponent, 
                {
                    title: 'Instrumento',
                    list: this.midiChoice.musicalInstrumentsAllowed,
                    callback: this.changeInstrumentMidiNumber.bind(this),
                    iconFunction: this.visualMidiProvider.getIonIconToMidiNumber,
                    nameFunction: this.visualMidiProvider.getInstrumentNameToMidiNumber,
                });
        } catch (e) {
            this.errorHandler(e);
        }
    }
    
    private changeInstrumentMidiNumber(instrumentMidiNumber: number): void {
        try {
            this.midiChoice.musicalInstrument = instrumentMidiNumber;
            this.backgroundSVGImageURL = null;
        } catch (e) {
            this.errorHandler(e);
        }
    }
}
