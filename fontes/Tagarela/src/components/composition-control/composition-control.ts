import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption, MusicalCompositionLine } from '../../model/musical-composition';
import { LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent extends GenericComponent {
    @ViewChild('scroll2') scroll2: ElementRef;

    //constants
    public static SPECTRUM_SIZE_OF_QUARTER_NOTE: number = 4.0;
    public static MIDI_TRACK: number = 0;

    private _compositionControl: MusicalCompositionControl;
    private _lineDashboardHeight: number;

    private _optionsInLines: number[];

    constructor(private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private visualMidiProvider: VisualMidiProvider,
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
        this.lineDashboardHeight = null;
    }

    get lineDashboardHeight(): number {
        return this._lineDashboardHeight;
    }

    set lineDashboardHeight(lineDashboardHeight: number) {
        this._lineDashboardHeight = lineDashboardHeight;
    }

    get optionsInLines(): number[] {
        return this._optionsInLines;
    }

    set optionsInLines(optionsInLines: number[]) {
        this._optionsInLines = optionsInLines;
    }

    private getOptionsList(): MusicalCompositionOption[] {
        try {
            if (this.compositionControl) {
                return  this.compositionControl.getOptionsToChoice();
            }
            return [];
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getCompositionLinesList():  MusicalCompositionLine[] {
        try {
            if (this.compositionControl && this.compositionControl.composition) {
                this.manageLinesScroll(this.compositionControl.composition.lines);
                return this.compositionControl.composition.lines;
            }
            return []
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private manageLinesScroll(lines: MusicalCompositionLine[]): void {
        let actualOptionsInLines: number[] = [];
        let changed: boolean = false;
        if (this.optionsInLines && lines) {
            if (this.optionsInLines.length != lines.length) {
                changed = true;
            }
            for (let i = 0; i < lines.length; i++) {
                actualOptionsInLines.push(lines[i].options.length)
                if (!changed && this.optionsInLines[i] != actualOptionsInLines[i]) {
                    changed = true;
                }
            }
        } else {
            changed = true;
        }

        if (changed) {
            if (this.scroll2 && this.scroll2.nativeElement) {
                setTimeout(() => {this.scroll2.nativeElement.scrollLeft = this.scroll2.nativeElement.scrollWidth;}, 100)
            }
            this.optionsInLines = actualOptionsInLines;
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

    private getWidthSize(midiChoice: MusicalCompositionOption): number {
        if (midiChoice && midiChoice.midi) {
            return midiChoice.midi.getDeltaTimeSum(CompositionControlComponent.MIDI_TRACK) / midiChoice.midi.getTimeDivisionMetric() * CompositionControlComponent.SPECTRUM_SIZE_OF_QUARTER_NOTE;
        }
        return 0;
    }

}
