import { Component, Input } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { PopoverController } from 'ionic-angular';
import { ListPopoverComponent } from '../list-popover/list-popover';
import { MidiConstants } from '../../control/midi';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { PlayMidiSpectrums, PlayMidiSpectrum } from '../../model/play-midi';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { FileProvider } from '../../providers/file/file';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';

@Component({
    selector: 'general-control',
    templateUrl: 'general-control.html'
})
export class GeneralControlComponent {
    
    @Input()
    private compositionControl: MusicalCompositionControl;


    constructor(private fileProvider: FileProvider,  public popoverCtrl: PopoverController, private visualMidiProvider: VisualMidiProvider) {        
    }

    teste() {
        this.compositionControl.generateCompositionMidi();
        let midi: PlayMidiSpectrums = new PlayMidiSpectrums();
        midi.midi = this.compositionControl.composition.midi;
        midi.midiId = this.compositionControl.composition.midiId;

        for (let line of this.compositionControl.composition.lines) {
            let spt: PlayMidiSpectrum = new PlayMidiSpectrum();
            for (let option of line.options) {
                let spectrumPalete = this.visualMidiProvider.getSpectrumPaleteByInstrumentType(this.visualMidiProvider.getInstrumentType(option.musicalInstrument));
                let backgroundSVGImageURL = encodeURI('data:image/svg+xml;utf8,' + option.midi
                                                                                    .generateMidiSpectrum(line.maxNote, line.minNote)
                                                                                    .getSVG(spectrumPalete[0], spectrumPalete[1], spectrumPalete[2]));
                spt.spectrumSVGs.push(backgroundSVGImageURL);
            }
            if (spt.spectrumSVGs.length > 0) {
                midi.spectrumLines.push(spt);
            }
        }
        
        const popover = this.popoverCtrl.create(PlayMidiComponent, 
            {
                spectrum: midi
            });
        popover.present();
    }


    public changeKeySignature(){
        const popover = this.popoverCtrl.create(ListPopoverComponent, 
            {
                title: 'Escolha a Armadura de Clave',
                list: MidiConstants.KEY_SIGNATURE_CONVERSION_VECTOR,
                callback: this.setKeySignature.bind(this),
                iconFunction: this.visualMidiProvider.getIonIconToMayorKeySignatureNumber,
                nameFunction: this.visualMidiProvider.getInstrumentNameToMayorKeySignatureNumber
            });
        popover.present();
    }

    public setKeySignature(keySignature: number) {
        this.compositionControl.composition.keySignature = keySignature;
    }


    public changeTempo(){
        const popover = this.popoverCtrl.create(SlidePopoverComponent, 
            {
                callback: this.setTempo.bind(this),
                color: 'danger',
                description: 'Tempo',
                value: this.compositionControl.composition.tempo,
                minRangeValue: this.compositionControl.composition.minTempo,
                maxRangeValue: this.compositionControl.composition.maxTempo,
                stepRangeValue: this.compositionControl.composition.stepTempo,
                snapsRange: false
            });
        popover.present();
    }

    public setTempo(tempo: number) {
        this.compositionControl.composition.tempo = tempo;
    }

    public undo() {
        this.compositionControl.undoChoice();
    }

    public compositionHasStarted(): boolean{
        return this.compositionControl.compositionHasStarted();
    }

    public compositionHasEnded(): boolean{
        return this.compositionControl.compositionHasEnded();
    }

    downloadAndOpenPdf() {
        /*const transfer = this.transfer.create();

        transfer.download(encodeURI(FileUtil._tempAreaDir + this.compositionControl.composition.midiId + '.mid'), 
        this.file.externalRootDirectory + 'Download/myfile.mid')
            .then(entry => {
                let url = entry.toURL();
                alert('Foi')
                alert(url)
                alert(JSON.stringify(url))
                this.file.listDir(this.file.externalRootDirectory, 'Download').then((a) => {alert(JSON.stringify(a))})            
                this.mediaUtil.playMidi(this.file.externalRootDirectory + 'Download/myfile.mid');
            
            })
        .catch(e => alert(JSON.stringify(e)));*/

        this.fileProvider.file.copyFile(this.fileProvider.tempAreaDir, this.compositionControl.composition.midiId + '.mid', this.fileProvider.file.externalRootDirectory + 'Download', 'copied2.mid')
            .then(() => {alert('foi')
            })
            .catch((e) => {alert(JSON.stringify(e))})

    }

}
