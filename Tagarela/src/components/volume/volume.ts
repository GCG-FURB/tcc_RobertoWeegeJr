import { Component, Input } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionLine, MusicalComposition } from '../../model/musical-composition';

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

    constructor(private file: File, private media: Media) {        
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

}
