import { Component, Input } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';
import { MusicalCompositionControl } from '../../control/musical-composition';

@Component({
    selector: 'general-control',
    templateUrl: 'general-control.html'
})
export class GeneralControlComponent {
    
    @Input()
    private compositionControl: MusicalCompositionControl;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    constructor(private file: File, private media: Media) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }

    teste() {
        this.compositionControl.generateCompositionMidi();
        this.playMidi();
    }

    public playMidi() {
        let midiString = this.compositionControl.composition.midi.getBinaryString();
        this.fileUtil.writeBinaryStringToTempArea(this.compositionControl.composition.midiId, midiString)
            .then(() => {
                this.mediaUtil.playMidiFromTempArea(this.compositionControl.composition.midiId);
            });
    }
}
