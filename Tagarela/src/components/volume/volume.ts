import { Component, Input } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionLine, MusicalComposition } from '../../model/musical-composition';
import { PopoverController } from 'ionic-angular';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { PlayMidiSpectrums, PlayMidiSpectrum } from '../../model/play-midi';
import { PlayMidiComponent } from '../play-midi/play-midi';
import { VisualMidiUtil } from '../../util/visual-midi';

@Component({
    selector: 'volume-component',
    templateUrl: 'volume.html'
})
export class VolumeComponent {

    private visualMidi: VisualMidiUtil = new VisualMidiUtil();

    @Input()
    private compositionLine: MusicalCompositionLine;

    @Input()
    private composition: MusicalComposition;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    constructor(private file: File, private media: Media, private popoverCtrl: PopoverController) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media);
    }

    teste() {
        this.composition.applyLineChanges(this.compositionLine)
        
        let midi: PlayMidiSpectrums = new PlayMidiSpectrums();
        midi.midi = this.compositionLine.midi;
        midi.midiId = this.compositionLine.midiId;

        let spt: PlayMidiSpectrum = new PlayMidiSpectrum();

        for (let option of this.compositionLine.options) {
            let spectrumPalete = this.visualMidi.getSpectrumPaleteByInstrumentType(this.visualMidi.getInstrumentType(option.musicalInstrument));
            let backgroundSVGImageURL = encodeURI('data:image/svg+xml;utf8,' + option.midi
                                                                                .generateMidiSpectrum(this.compositionLine.maxNote, this.compositionLine.minNote)
                                                                                .getSVG(spectrumPalete[0], spectrumPalete[1], spectrumPalete[2]));
            spt.spectrumSVGs.push(backgroundSVGImageURL);
        }
        midi.spectrumLines.push(spt);
        
        const popover = this.popoverCtrl.create(PlayMidiComponent, 
            {
                spectrum: midi
            });
        popover.present();
        
        //this.playMidi();
    }

    public playMidi() {
        let midiString = this.compositionLine.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.compositionLine.midiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.compositionLine.midiId, null);
            });
    }

    volumeDown(){
        this.compositionLine.volumeDown();
    }

    volumeUp(){
        this.compositionLine.volumeUp();
    }


    public goToVolumePopover(){
        const popover = this.popoverCtrl.create(SlidePopoverComponent, 
            {
                callback: this.changeVolume.bind(this),
                color: 'secondary',
                description: 'Volume',
                value: this.compositionLine.volume,
                minRangeValue: this.compositionLine.minVolume,
                maxRangeValue: this.compositionLine.maxVolume,
                stepRangeValue: this.compositionLine.stepVolume,
                snapsRange: false
            });
        popover.present();
    }

    public changeVolume(volume: number) {
        this.compositionLine.volume = volume;
    }

    private getVolumeIcon(){
        if (this.compositionLine.volume == 0) {
            return 'volume-mute'
        }
        if (this.compositionLine.volume <= this.compositionLine.maxVolume/2) {
            return 'volume-down'
        }
        return 'volume-up'
    }

}
