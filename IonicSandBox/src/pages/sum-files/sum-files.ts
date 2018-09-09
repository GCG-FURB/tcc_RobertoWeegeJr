import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Media } from '@ionic-native/media';
import { File, IWriteOptions } from '@ionic-native/file';
import { Midi } from '../../app/midi.util/midi';

/**
 * Generated class for the VisualPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sum-files',
  templateUrl: 'sum-files.html',
})
export class SumFiles {

    melodiaMidiPath;
    harmoniaMidiPath;
    bassMidiPath;

    fileNewConvertedPath;

    constructor(public navCtrl: NavController, public navParams: NavParams, private media: Media, private file: File) {
        this.melodiaMidiPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Melodia.mid';
        this.harmoniaMidiPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Harmonia.mid';
        this.bassMidiPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Bass.mid';
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SumFiles');
    }

    playMidiFile(path: string) {
        //const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
        try {
            const file = this.media.create(path);
            file.play();    
        } catch (e) {
            alert('erro ' + e)
        }
     
    }

    async sumFiles()  {
        try { 
            let melodia: Midi = await this.loadMidi(this.melodiaMidiPath);
            let harmonia: Midi = await this.loadMidi(this.harmoniaMidiPath);
            let bass: Midi = await this.loadMidi(this.bassMidiPath);
    
            let newMidi: Midi = new Midi();
            await newMidi.generateMidiType1([melodia, harmonia, bass]);

            this.createNewMidiFile(newMidi);

        } catch (e) {
            alert(JSON.stringify(e));
        }
    }

    async loadMidi(fileConvertedPath) {
        /*alert(this.fileConvertedPath.substr(0, this.fileConvertedPath.lastIndexOf('/')));
        alert(this.fileConvertedPath.substr(this.fileConvertedPath.lastIndexOf('/') + 1));*/
    
        try {
            let midi: Midi = new Midi();
            let m = await this.file.readAsBinaryString(fileConvertedPath.substr(0, fileConvertedPath.lastIndexOf('/')), fileConvertedPath.substr(fileConvertedPath.lastIndexOf('/') + 1))
            midi.setupMidiFromFile(m);
            return midi;
        } catch(e){
            alert(JSON.stringify(e));
        }

    }
    
    createNewMidiFile(midi){
        /*alert(this.file.externalDataDirectory);
        this.file.createFile(this.file.externalDataDirectory ,'newMidiFile.mid', true)
        .then(a => alert(JSON.stringify(a)))
        .catch(e => alert(JSON.stringify(e)));*/
    
        let options: IWriteOptions = { replace: true };
        let newMidi = midi.getBinaryString();
    
        const len = newMidi.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = newMidi.charCodeAt(i);
        }
    
        this.file.writeFile(this.file.externalDataDirectory ,'newMidiFileSum.mid', bytes.buffer, options)
          .then(a => this.fileNewConvertedPath = this.file.externalDataDirectory + 'newMidiFileSum.mid')
          .catch(e => alert(JSON.stringify(e)));
      }


}
