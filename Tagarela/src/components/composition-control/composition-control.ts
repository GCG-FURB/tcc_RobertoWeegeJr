import { Component, Input } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption } from '../../model/musical-composition';
import { LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';

@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent extends GenericComponent {
    
    private _compositionControl: MusicalCompositionControl;

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

    public get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }

    @Input()
    public set compositionControl(value: MusicalCompositionControl) {
        this._compositionControl = value;
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
            if (this.compositionControl 
                && this.compositionControl.composition) {
                return this.compositionControl.composition.lines;
            }
            return []
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getCompositionOptionsList(lineIndex: number){
        try {
            if (this.compositionControl 
                && this.compositionControl.composition) {
                return this.compositionControl.composition.lines[lineIndex].options;
            }
            return []
        } catch (e) {
            this.errorHandler(e)
        }
    }
}
