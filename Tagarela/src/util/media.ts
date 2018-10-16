import { Media } from '@ionic-native/media';
import { FileUtil } from './file';

export class MediaUtil {

    private _nativeMedia: Media;

    constructor(nativeMedia: Media) {
        this._nativeMedia = nativeMedia;
    }

    public async playMidiFromTempArea(uId: string, callback: Function){
        const file = this._nativeMedia.create(FileUtil._tempAreaDir + uId + '.mid');
        
        file.onSuccess.subscribe(() => {
            file.release();
            callback();
        });

        /*file.onStatusUpdate.subscribe((a) => {
            alert(JSON.stringify(a))
        });*/

        try {
            file.play();
            /*setTimeout(() => {
                alert(file.getDuration())
            }, 200)*/
            /*setTimeout(() => {
                file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))
                    file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))
                        file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))
                            file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))
                                file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))
                                    file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))
                                        file.getCurrentPosition().then((a)=>{alert(JSON.stringify(a))})
                                    })
                                })
                            })
                        })
                    })
                })
            }, 200)*/

        } catch (e) {
            alert(JSON.stringify(e))
        }
    }


    
    public playMidi(filePath: string){

        const file = this._nativeMedia.create(filePath);
        file.play();

    }



}