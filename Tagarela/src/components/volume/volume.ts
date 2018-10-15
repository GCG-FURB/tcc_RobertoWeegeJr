import { Component, Input } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionLine, MusicalComposition } from '../../model/musical-composition';
import { PopoverController } from 'ionic-angular';
import { SlidePopoverComponent } from '../slide-popover/slide-popover';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';

@Component({
    selector: 'volume-component',
    templateUrl: 'volume.html'
})
export class VolumeComponent {

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
        this.playMidi();
    }

    public playMidi() {
        let midiString = this.compositionLine.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.compositionLine.midiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.compositionLine.midiId);
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
