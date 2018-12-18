import { Component, Input } from '@angular/core';
import { MusicalCompositionLine} from '../../model/musical-composition';
import { PopoverController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { GenericComponent } from '../../control/generic-component';
import { MidiSpectrumSvgProvider } from '../../providers/midi-spectrum-svg/midi-spectrum-svg';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { CompositionMidiSpectrumsData } from '../../model/midi-spectrum';
import { Device } from '@ionic-native/device';

@Component({
    selector: 'line-control-component',
    templateUrl: 'line-control.html'
})
export class LineControlComponent extends GenericComponent {
    
    private _compositionLine: MusicalCompositionLine;
    private _compositionControl: MusicalCompositionControl;
    
    constructor(private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private midiSpectrumSvgProvider: MidiSpectrumSvgProvider,
                private toastCtrl: ToastController,
                private dev: Device) {

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl,
              dev);
    }

    get compositionLine(): MusicalCompositionLine {
        return this._compositionLine;
    }

    @Input()
    set compositionLine(compositionLine: MusicalCompositionLine) {
        this._compositionLine = compositionLine;
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
            if (this.compositionLine.options.length > 0) {
                this.compositionControl.applyLineChanges(this.compositionLine);
                this.startPopover (
                    PlayMidiComponent, 
                    {
                        spectrum: this.getSVGMidiSpectrum(),
                        midi: this.compositionLine.midi,
                        midiId: this.compositionLine.midiId
                    },
                    {   
                        cssClass: 'custom-popover',
                        enableBackdropDismiss: false
                    }
                );
            }
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private goToVolumePopover(): void {
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
                    snapsRange: false,
                }
            );
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private changeVolume(volume: number): void {
        try {
            this.compositionLine.volume = volume;
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getVolumeIcon(): string {
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

    private getSVGMidiSpectrum(): string {
        let compositionMidiSpectrumsData: CompositionMidiSpectrumsData = this.compositionControl.getCompositionMidiSpectrums(this.compositionLine);
        return this.midiSpectrumSvgProvider.concatenateSpectrums(compositionMidiSpectrumsData.spectrums, 
                                                                 compositionMidiSpectrumsData.musicalInstruments, 
                                                                 this.compositionLine.midi.getTimeDivisionMetric(), 
                                                                 compositionMidiSpectrumsData.minNotes, 
                                                                 compositionMidiSpectrumsData.maxNotes);
    }

}
