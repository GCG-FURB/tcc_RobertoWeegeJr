import { Component, Input } from '@angular/core';
import { CompositionLine } from '../../util/composition';
import { File } from '@ionic-native/file';
import { FileUtil } from '../../util/file';
import { Media } from '@ionic-native/media';
import { MediaUtil } from '../../util/media';

/**
 * Generated class for the VolumeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'volume-component',
    templateUrl: 'volume.html'
})
export class VolumeComponent {

    @Input()
    private compositionLine: CompositionLine;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;


    constructor(private file: File, private media: Media) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }

    teste() {
        this.compositionLine.generateLineMidi()
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
