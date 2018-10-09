import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Media } from '@ionic-native/media';
import { MusicalCompositionSource, MusicalCompositionStep, Composition } from '../../util/composition';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage {

    private composition: Composition;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
                private file: File,  private filePath: FilePath, private media: Media) {

        alert(this.file.applicationDirectory)
        this.loadMidiFiles();
    }

    private async loadMidiFiles(){
        try {
            let musicalCompositionSource: MusicalCompositionSource = new MusicalCompositionSource(this.file); 
            musicalCompositionSource.buildSource(this.file.applicationDirectory, 'www/assets/Teste').then(()=>{
                this.composition = new Composition(musicalCompositionSource);
                /*for (let ev of musicalCompositionSource.rootStep.musicalCompositionLine[0].musicalCompositionOption[0].midi.midiTracks[0].midiEvents
                ){
                    alert(ev.midiEventData)
                }*/
            });

            /*let num: number = 1;
            let hexNum = num.toString(16);
            alert(hexNum);
            
            num = 20;
            hexNum = num.toString(16);
            alert(hexNum);

            let decNum = parseInt(hexNum, 16);
            alert(decNum);

            num = -1;
            hexNum = num.toString(16);
            alert(hexNum);*/



            /*
            00 02 = +2
            02 00 = -2
            FF 00 = +1
            00 FF = -1
            -1 00 = +1
            00 -1 = -1
            */

        } catch (e) {

        }   
    }

    ionViewDidLoad() {}

    playMidiFile(path: string) {
        const file = this.media.create(path);
        try {
            file.play();
        } catch (e) {
            alert(JSON.stringify(e))
        }
        
      }
    
}



