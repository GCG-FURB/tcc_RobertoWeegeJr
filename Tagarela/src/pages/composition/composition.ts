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
        this.loadMidiFiles();
    }

    private async loadMidiFiles(){
    }

    ionViewDidLoad() {
        this.composition = new Composition(this.navParams.get('compositionSource') );
    }

    playMidiFile(path: string) {
        const file = this.media.create(path);
        try {
            file.play();
        } catch (e) {
            alert(JSON.stringify(e))
        }
        
      }
    
}



