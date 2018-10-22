import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { MediaProvider } from '../../providers/media/media';
import { MidiControl } from '../../control/midi';
import { Midi } from '../../model/midi';
import { GenericComponent } from '../../control/generic-component';

@Component({
  selector: 'play-midi',
  templateUrl: 'play-midi.html'
})
export class PlayMidiComponent extends GenericComponent{

    private _spectrum: string;
    private _midi: Midi;
    private _midiId: string;
    private _midiControl: MidiControl;

    constructor(private navCtrl: NavController, 
                private navParams: NavParams, 
                private fileProvider: FileProvider, 
                private mediaProvider: MediaProvider,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController) {

        super(loadingCtrl,
            alertCtrl,
            popoverCtrl);
    
    }

    public get spectrum(): string {
        return this._spectrum;
    }

    public set spectrum(value: string) {
        this._spectrum = value;
    }

    public get midi(): Midi {
        return this._midi;
    }

    public set midi(value: Midi) {
        this._midi = value;
    }

    public get midiId(): string {
        return this._midiId;
    }

    public set midiId(value: string) {
        this._midiId = value;
    }

    public get midiControl(): MidiControl {
        return this._midiControl;
    }
    
    public set midiControl(value: MidiControl) {
        this._midiControl = value;
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
            this.playMidi();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private async playMidi() {
        try { 
            let midiString = this.midiControl.getBinaryString(this.midi);
            await this.fileProvider.writeBinaryStringToTempArea(this.midiId, midiString);
            await this.mediaProvider.playMidiFromTempArea(this.midiId, this.goBack.bind(this));
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

}
