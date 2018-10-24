import { Component, Input } from '@angular/core';
import { MusicalCompositionLine} from '../../model/musical-composition';
import { PopoverController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { GenericComponent } from '../../control/generic-component';
import { MidiSpectrumSvgProvider } from '../../providers/midi-spectrum-svg/midi-spectrum-svg';
import { MidiSpectrum } from '../../model/midi-spectrum';
import { MusicalCompositionControl } from '../../control/musical-composition';

@Component({
    selector: 'line-control-component',
    templateUrl: 'line-control.html'
})
export class LineControl extends GenericComponent {
    
    private _compositionLine: MusicalCompositionLine;
    private _compositionControl: MusicalCompositionControl;
    
    constructor(private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private midiSpectrumSvgProvider: MidiSpectrumSvgProvider,
                private toastCtrl: ToastController) {

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl);
    }

    public get compositionLine(): MusicalCompositionLine {
        return this._compositionLine;
    }

    @Input()
    public set compositionLine(value: MusicalCompositionLine) {
        this._compositionLine = value;
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
            this.compositionControl.applyLineChanges(this.compositionLine);
            this.startPopover (
                PlayMidiComponent, 
                {
                    spectrum: this.getSvgImageImage(),
                    midi: this.compositionLine.midi,
                    midiId: this.compositionLine.midiId
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }
    private goToVolumePopover(){
        try {
            this.startPopover(
                SlidePopoverComponent, 
                {
                    callback: this.changeVolume.bind(this),
                    color: 'secondary',
                    description: 'Volume',
                    value: this.compositionLine.volume,
                    minRangeValue: this.compositionLine.minVolume,
                    maxRangeValue: this.compositionLine.maxVolume,
                    stepRangeValue: this.compositionLine.stepVolume,
                    snapsRange: false
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private changeVolume(volume: number) {
        try {
            this.compositionLine.volume = volume;
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getVolumeIcon(){
        try {
            if (this.compositionLine.volume == 0) {
                return 'volume-mute'
            }
            if (this.compositionLine.volume <= this.compositionLine.maxVolume/2) {
                return 'volume-down'
            }
            return 'volume-up'
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getSvgImageImage(): string {
        let spectrums: MidiSpectrum[][] = [];
        let musicalInstruments: number[][] = [];

        let lineSpectrums: MidiSpectrum[] = []; 
        let lineMusicalInstruments: number[] = [];
        let minNotes: number[] = [];
        let maxNotes: number[] = [];

        for (let option of this.compositionLine.options) {
            lineSpectrums.push(option.spectrum);
            lineMusicalInstruments.push(option.musicalInstrument);
        }

        minNotes.push(this.compositionLine.getMinSpectrumNote())
        maxNotes.push(this.compositionLine.getMaxSpectrumNote())
        spectrums.push(lineSpectrums);
        musicalInstruments.push(lineMusicalInstruments);

        return this.midiSpectrumSvgProvider.concatenateSpectrums(spectrums, musicalInstruments, minNotes, maxNotes);
    }

}
