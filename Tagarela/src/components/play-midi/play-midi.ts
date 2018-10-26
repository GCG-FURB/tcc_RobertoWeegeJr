import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { MidiControl } from '../../control/midi';
import { Midi } from '../../model/midi';
import { GenericComponent } from '../../control/generic-component';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'play-midi',
  templateUrl: 'play-midi.html'
})
export class PlayMidiComponent extends GenericComponent{

    @ViewChild('spectrumDiv') spectrumDiv: ElementRef;
    @ViewChild('indicator') indicator: ElementRef;

    private SPECTRUM_SIZE_OF_QUARTER_NOTE: number = 11.25;
    private AVAILABLE_SPECTRUM_SIZE: number = 90;

    private _spectrum: string;
    private _midi: Midi;
    private _midiId: string;
    private _midiControl: MidiControl;

    private _file: MediaObject;

    private _startPlay: boolean;
    private _fileDuration: number; 
    private _startPlayCount: number;
    
    private _indicatorMarginLeft: number;
    private _spectrumMarginLeft: number;

    private _spectrumSize: number;

    constructor(private navCtrl: NavController, 
                private navParams: NavParams, 
                private fileProvider: FileProvider, 
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private toastCtrl: ToastController,
                private nativeMedia: Media) {

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl);
    
    }

    get spectrum(): string {
        return this._spectrum;
    }

    set spectrum(spectrum: string) {
        this._spectrum = spectrum;
    }

    get midi(): Midi {
        return this._midi;
    }

    set midi(midi: Midi) {
        this._midi = midi;
    }

    get midiId(): string {
        return this._midiId;
    }

    set midiId(midiId: string) {
        this._midiId = midiId;
    }

    get midiControl(): MidiControl {
        return this._midiControl;
    }
    
    set midiControl(midiControl: MidiControl) {
        this._midiControl = midiControl;
    }

    public get file(): MediaObject {
        return this._file;
    }
    public set file(file: MediaObject) {
        this._file = file;
    }

    get startPlay(): boolean {
        return this._startPlay;
    }

    set startPlay(startPlay: boolean) {
        this._startPlay = startPlay;
    }

    get fileDuration(): number {
        return this._fileDuration;
    }

    set fileDuration(fileDuration: number) {
        this._fileDuration = fileDuration;
    }

    get startPlayCount(): number {
        return this._startPlayCount;
    }

    set startPlayCount(startPlayCount: number) {
        this._startPlayCount = startPlayCount;
    }

    get indicatorMarginLeft(): number {
        return this._indicatorMarginLeft
    }

    set indicatorMarginLeft(indicatorMarginLeft: number){
        if (this.indicator) 
            this.indicator.nativeElement.style.marginLeft = indicatorMarginLeft + 'vw';
        this._indicatorMarginLeft = indicatorMarginLeft;
    }
    get spectrumMarginLeft(): number {
        return this._spectrumMarginLeft;
    }
    set spectrumMarginLeft(spectrumMarginLeft: number) {
        if (this.spectrumDiv) 
            this.spectrumDiv.nativeElement.style.marginLeft = spectrumMarginLeft + 'vw'
        this._spectrumMarginLeft = spectrumMarginLeft;
    }

    get spectrumSize(): number {
        return this._spectrumSize;
    }

    set spectrumSize(spectrumSize: number) {
        if (this.spectrumDiv) 
            this.spectrumDiv.nativeElement.style.width = spectrumSize + 'vw'
        this._spectrumSize = spectrumSize;
    }
    
    private ngOnInit(): void {
        try { 
            this.midiControl = new MidiControl();
            this.spectrum = this.navParams.get("spectrum");
            this.midi = this.navParams.get("midi");
            this.midiId = this.navParams.get("midiId");
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private ionViewDidLoad(): void {
        try { 
            this.startPlayCount = 0;
            this.indicatorMarginLeft = 0;
            this.spectrumMarginLeft = 0;
            let maxDeltaTimeSum: number = 0;
            for (let i = 0; i < this.midi.midiTracks.length; i++ ) {
                let midiDeltaTimeSum: number = this.midi.getDeltaTimeSum(i);
                if (midiDeltaTimeSum > maxDeltaTimeSum) {
                    maxDeltaTimeSum = midiDeltaTimeSum;
                }
            }
            this.spectrumSize = maxDeltaTimeSum/this.midi.getTimeDivisionMetric() * this.SPECTRUM_SIZE_OF_QUARTER_NOTE;
            this.playMidi();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private async playMidi() {
        try { 
            let midiString = this.midiControl.getBinaryString(this.midi);
            await this.fileProvider.writeMidiBinaryStringToTempArea(this.midiId, midiString);
            this.file = await this.nativeMedia.create(this.fileProvider.tempAreaFullDir + this.midiId + '.mid');
            
            await this.file.onSuccess.subscribe(() => {
                this.file.release();
                this.goBack();
            });
    
            await this.file.onError.subscribe((e) => {
                this.errorHandler(e);
            });

            await this.file.onStatusUpdate.subscribe(async (status) => {
                if (status == 2) {
                    this.updateViewValues();
                }
            });
            await this.file.play();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private goBack() {
        try { 
            this.navCtrl.pop();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private updateViewValues() {
        setTimeout(() => {
            try {
                this.fileDuration = this.file.getDuration();
                if (!this.fileDuration || this.fileDuration < 0) {
                    if (this.startPlayCount > 100) {
                        throw new Error('A composição não foi iniciada a tempo.');
                    }
                    this.updateViewValues();
                    this.startPlayCount++;
                } else {
                    this.updateIndicators();            
                }
            } catch (e) {
                this.errorHandler(e);
            }
        }, 10);
    }

    private updateIndicators(){
        setTimeout(async() => {
            try {
                let percentOfPlay: number;
                let currentPosition = await this.file.getCurrentPosition();
                if (currentPosition < 0) {
                    this.indicatorMarginLeft = this.AVAILABLE_SPECTRUM_SIZE; 
                } else {
                    percentOfPlay = currentPosition / this.fileDuration;
                    let qtyToApply = this.spectrumSize * percentOfPlay
                    
                    if ((qtyToApply > this.AVAILABLE_SPECTRUM_SIZE/2)) {
                        let diff: number = this.AVAILABLE_SPECTRUM_SIZE/2 - this.indicatorMarginLeft;
                        if (diff > 0) {
                            this.indicatorMarginLeft = this.AVAILABLE_SPECTRUM_SIZE/2;
                            qtyToApply -= diff;
                        }
                        if ((this.spectrumSize + this.spectrumMarginLeft > this.AVAILABLE_SPECTRUM_SIZE)) {
                            this.spectrumMarginLeft = (qtyToApply - this.indicatorMarginLeft) * -1
                        } else {
                            this.indicatorMarginLeft = qtyToApply + this.spectrumMarginLeft; 
                        }
                    } else {
                        let diff: number = qtyToApply - this.AVAILABLE_SPECTRUM_SIZE/2;
                        if (diff > 0) {
                            this.indicatorMarginLeft = this.AVAILABLE_SPECTRUM_SIZE/2;
                            this.spectrumMarginLeft = diff * - 1;
                        } else {
                            this.indicatorMarginLeft = (qtyToApply > this.indicatorMarginLeft ? qtyToApply: this.indicatorMarginLeft);
                        }
                    }
                    this.updateIndicators();
                }
            } catch (e) {
                this.errorHandler(e);
            }
        }, 10);
    }

    public errorHandler(e){
        super.errorHandler(e);
        this.navCtrl.pop();
    };


}
