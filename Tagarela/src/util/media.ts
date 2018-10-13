import { Media } from '@ionic-native/media';
import { FileUtil } from './file';

export class MediaUtil {

    private _nativeMedia: Media;

    constructor(nativeMedia: Media) {
        this._nativeMedia = nativeMedia;
    }

    public playMidiFromTempArea(uId: string){
        const file = this._nativeMedia.create(FileUtil._tempAreaDir + uId + '.mid');
        try {
            file.play();
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




}