import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption, MusicalCompositionLine } from '../../model/musical-composition';
import { LoadingController, AlertController, PopoverController, ToastController, Content } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';

@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent extends GenericComponent {
    @ViewChild('scroll2') scroll2: ElementRef;

    private _compositionControl: MusicalCompositionControl;
    private _lineDashboardHeight: number;

    private _optionsInLines: number[];

    constructor(private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private visualMidiProvider: VisualMidiProvider,
                private toastCtrl: ToastController) {
        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl);
    }

    get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }

    @Input()
    set compositionControl(compositionControl: MusicalCompositionControl) {
        this._compositionControl = compositionControl;
        this.lineDashboardHeight = null;
    }

    public get lineDashboardHeight(): number {
        return this._lineDashboardHeight;
    }

    public set lineDashboardHeight(value: number) {
        this._lineDashboardHeight = value;
    }

    public get optionsInLines(): number[] {
        return this._optionsInLines;
    }
    public set optionsInLines(value: number[]) {
        this._optionsInLines = value;
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

    private getCompositionLinesList(){
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

    private manageLinesScroll(lines: MusicalCompositionLine[]) {
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

}
