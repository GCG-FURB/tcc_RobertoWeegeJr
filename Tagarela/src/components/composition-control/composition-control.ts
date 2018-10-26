import { Component, Input, ViewChild, ElementRef } from '@angular/core';
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

    @ViewChild('scroll2Control') scroll2Control: ElementRef;
    @ViewChild('scroll2') scroll2: ElementRef;

    //height
    private LINE_DASHBOARD_HEIGHT: number = 12;
    private LINE_DASHBOARD_HEIGHT_ADJUST: number = 2;

    private _compositionControl: MusicalCompositionControl;

    private _lineDashboardHeight: number;

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
        this.calcLinesDashboardHeigth();
    }

    public get lineDashboardHeight(): number {
        return this._lineDashboardHeight;
    }

    public set lineDashboardHeight(value: number) {
        this._lineDashboardHeight = value;
    }

    private calcLinesDashboardHeigth(){
        if ((this.lineDashboardHeight || this.lineDashboardHeight == 0)
            &&  this.scroll2Control.nativeElement && this.scroll2.nativeElement) {
            this.lineDashboardHeight = this.getLineDashboardHeigth();
            this.scroll2Control.nativeElement.style.height = this.lineDashboardHeight;
            this.scroll2.nativeElement.style.height = this.lineDashboardHeight
        }
    }

    private getLineDashboardHeigth(): number {
        return (this.LINE_DASHBOARD_HEIGHT * this.getCompositionLinesList.length) + this.LINE_DASHBOARD_HEIGHT_ADJUST;
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
                this.calcLinesDashboardHeigth();
                return this.compositionControl.composition.lines;
            }
            return []
        } catch (e) {
            this.errorHandler(e)
        }
    }

    private getCompositionOptionsList(lineIndex: number){
        try {
            if (this.compositionControl && this.compositionControl.composition) {
                return this.compositionControl.composition.lines[lineIndex].options;
            }
            return []
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

}
