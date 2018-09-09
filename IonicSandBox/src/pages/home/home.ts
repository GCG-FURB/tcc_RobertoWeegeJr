import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { File, IWriteOptions } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { Midi } from '../../app/midi.util/midi';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '../../../node_modules/@ionic-native/file-path';
import { VisualPage } from '../visual/visual';
import { SumFiles } from '../sum-files/sum-files';
import { DragPage } from '../drag/drag';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  angle: Number;
  transformStyle: String;
  title = 'Rotate Me!';


  fileUri: string;
  fileConvertedPath: string;
  midi;
  fileNewConvertedPath: string;

  actualMidiFile;

  constructor(public navCtrl: NavController, private file: File , private media: Media, 
    private fileChooser: FileChooser, private filePath: FilePath) {
      this.fileConvertedPath = this.file.externalDataDirectory + 'Teste Midi/' + 'Teste TCC - Harmonia.mid';
      this.angle=0;
      this.transformStyle="rotate(0deg)"; 
    }

    onRotation(event: any): void {
      this.angle=event.angle;
      this.transformStyle="rotate("+this.angle+"deg)";
    }

  goToVisualPage() {
    this.navCtrl.push(VisualPage);
  }

  goToSumFiles() {
    this.navCtrl.push(SumFiles);
  }
  
  goToDragPage() {
    this.navCtrl.push(DragPage);
  }

  

  selectFileURI(){
    this.fileChooser.open()
      .then(uri => {
        this.fileUri = uri
        this.filePath.resolveNativePath(uri)
          .then(path => this.fileConvertedPath = path)
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }


  playMidiFile(path: string) {
    //const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
    const file = this.media.create(path);
    file.play();
  }

  loadMidi() {
    /*alert(this.fileConvertedPath.substr(0, this.fileConvertedPath.lastIndexOf('/')));
    alert(this.fileConvertedPath.substr(this.fileConvertedPath.lastIndexOf('/') + 1));*/

    this.file.readAsBinaryString(this.fileConvertedPath.substr(0, this.fileConvertedPath.lastIndexOf('/')), this.fileConvertedPath.substr(this.fileConvertedPath.lastIndexOf('/') + 1))
    .then(a=>{
      try {
        this.actualMidiFile = a;
        let midi: Midi = new Midi();
        midi.setupMidiFromFile(a);
        this.midi = midi;
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }).catch(e=>{
      alert(JSON.stringify(e));
    });  
  }

  createNewMidiFile(){
    /*alert(this.file.externalDataDirectory);
    this.file.createFile(this.file.externalDataDirectory ,'newMidiFile.mid', true)
    .then(a => alert(JSON.stringify(a)))
    .catch(e => alert(JSON.stringify(e)));*/

    let options: IWriteOptions = { replace: true };
    let newMidi = this.midi.getBinaryString();

    const len = newMidi.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = newMidi.charCodeAt(i);
    }

    this.file.writeFile(this.file.externalDataDirectory ,'newMidiFile.mid', bytes.buffer, options)
      .then(a => this.fileNewConvertedPath = this.file.externalDataDirectory + 'newMidiFile.mid')
      .catch(e => alert(JSON.stringify(e)));
  }

  /*vai(){
    //alert(this.file.externalRootDirectory);
    //readAsArrayBuffer
    //readAsBinaryString

    /*const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
    file.play();*/

    /*this.file.readAsBinaryString(this.file.externalRootDirectory + '/Download',
     'testenew2.mid').then(a=>{
      //alert('Foi!');
      //alert(JSON.stringify(a));
      //alert(a);
      //alert(a.byteLength);
      
      try {
        let midi: Midi = new Midi();
        midi.setupMidiFromFile(a);
        
        /*alert(midi.midiType);
        alert(midi.numberOfTracks);
        alert(midi.timeDivision);*/
      /*} catch (e) {
        alert('Deu ruim');
        alert(e);
      }

      
      //for (let bb of a) {
        //alert(bb.charCodeAt(0).toString(16));
        //file.stop();
      //} 
      //console.log(a);
    }).catch(e=>{
      alert('não');
      alert(JSON.stringify(e));
      console.log(e);
    });
  }*/

}