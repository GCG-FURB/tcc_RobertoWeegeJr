import { Component, Input } from '@angular/core';
import { CompositionLine, Composition } from '../../util/composition';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';

@Component({
    selector: 'volume-component',
    templateUrl: 'volume.html'
})
export class VolumeComponent {

    @Input()
    private compositionLine: CompositionLine;

    @Input()
    private composition: Composition;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;


    constructor(private file: File, private media: Media) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }

    teste() {
        this.compositionLine.generateLineMidi()
        if (this.compositionLine.lineMidi) {
            this.compositionLine.lineMidi.applyNoteTranspose(this.composition.getSignatureKey());
            this.compositionLine.lineMidi.applyTempoChange(this.composition.getTempo());
        }
        this.playMidi();
    }

    public playMidi() {
        let midiString = this.compositionLine.lineMidi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.compositionLine.lineMidiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.compositionLine.lineMidiId);
            });
    }

}
