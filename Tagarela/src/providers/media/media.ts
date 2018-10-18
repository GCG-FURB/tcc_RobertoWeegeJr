import { Injectable } from '@angular/core';
import { Media } from '@ionic-native/media';
import { FileProvider } from '../file/file';

@Injectable()
export class MediaProvider {

    constructor(private nativeMedia: Media, private fileProvider: FileProvider) {}

    public async playMidiFromTempArea(uId: string, callback: Function){

        const file = this.nativeMedia.create(this.fileProvider.tempAreaDir + uId + '.mid');
        
        file.onSuccess.subscribe(() => {
            file.release();
            callback();
        });

        try {
            file.play();
        } catch (e) {
            alert(JSON.stringify(e))
        }

    }
    
    public playMidi(filePath: string){
        const file = this.nativeMedia.create(filePath);
        file.play();

    }

}
