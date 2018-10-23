import { Component } from '@angular/core';
import { Midi } from '../../model/midi';
import { GenericComponent } from '../../control/generic-component';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { MediaProvider } from '../../providers/media/media';
import { MidiControl } from '../../control/midi';

@Component({
  selector: 'download-midi',
  templateUrl: 'download-midi.html'
})
export class DownloadMidiComponent extends GenericComponent{

    private _fileName: string;
    private _midi: Midi;
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

    get fileName(): string {
        return this._fileName;
    }

    set fileName(fileName: string) {
        this._fileName = fileName;
    }

    get midi(): Midi {
        return this._midi;
    }

    set midi(midi: Midi) {
        this._midi = midi;
    }

    get midiControl(): MidiControl {
        return this._midiControl;
    }
    
    set midiControl(midiControl: MidiControl) {
        this._midiControl = midiControl;
    }

    private ngOnInit(): void {
        try { 
            this.midiControl = new MidiControl();
            this.midi = this.navParams.get("midi");
            this.fileName = 'Minha Composição'
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private async downloadMidi() {
        
        try {
            this.createLoading('Baixando Arquivo');
            await this.fileProvider.writeBinaryStringDownloadArea(this.fileName, this.midiControl.getBinaryString(this.midi));
            this.dismissLoading();
            this.startAlert({
                title: 'Arquivo Baixado com Sucesso',
                subTitle: 'Verifique a pasta de download do dispositivo.',
                buttons: ['OK']
            });
        } catch (e) {
            this.errorHandler(e);
        }

    }

}