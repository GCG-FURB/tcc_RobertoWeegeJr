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
    
    //Tone control
    private toneIndex: number = 0;
    private TONE_VALUES: string[] = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

    //Tempo control
    private MIN_TEMPO_VALUE: number = 40;
    private MAX_TEMPO_VALUE: number = 200;
    private tempoValue: number = 60;

    private fileUtil: FileUtil;
    private mediaUtil: MediaUtil;

    constructor(private file: File, private media: Media) {        
        this.fileUtil = new FileUtil(file);
        this.mediaUtil = new MediaUtil(media)
    }
    teste() {
        this.composition.generateGeneralMidi();
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
