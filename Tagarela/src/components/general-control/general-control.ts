import { Component, Input } from '@angular/core';
import { Composition } from '../../util/composition';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';

@Component({
    selector: 'general-control',
    templateUrl: 'general-control.html'
})
export class GeneralControlComponent {
    
    @Input()
    private composition: Composition;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    constructor(private file: File, private media: Media) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }
    teste() {
        this.composition.generateGeneralMidi();
        if (this.composition.midi) {
            this.composition.midi.applyNoteTranspose(this.composition.getSignatureKey());
            this.composition.midi.applyTempoChange(this.composition.getTempo());
        }
        this.playMidi();
    }

    public playMidi() {
        let midiString = this.composition.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.composition.midiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.composition.midiId);
            });
    }
}
