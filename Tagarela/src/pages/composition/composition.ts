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
        try {
            let musicalCompositionSource: MusicalCompositionSource = new MusicalCompositionSource(this.file); 
            musicalCompositionSource.buildSource(this.file.dataDirectory, 'Teste').then(()=>{
                this.composition = new Composition(musicalCompositionSource);
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

    testeP1M1(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/1-melodia/M1-S1.mid')  }
    testeP1M2(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/1-melodia/M2-S1.mid')  }
    testeP1M3(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/1-melodia/M3-S1.mid')  }
    testeP1H1(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/2-harmonia/H1-S1.mid') }
    testeP1H2(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/2-harmonia/H2-S1.mid') }
    testeP1H3(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/2-harmonia/H3-S1.mid') }
    testeP1R1(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/3-ritmo/R1-S1.mid')    }
    testeP1R2(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/3-ritmo/R2-S1.mid')    }
    testeP1R3(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-1/3-ritmo/R3-S1.mid')    }
    testeP2M1(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/1-melodia/M1-S2.mid')  }
    testeP2M2(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/1-melodia/M2-S2.mid')  }
    testeP2M3(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/1-melodia/M3-S2.mid')  }
    testeP2H1(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/2-harmonia/H1-S2.mid') }
    testeP2H2(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/2-harmonia/H2-S2.mid') }
    testeP2H3(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/2-harmonia/H3-S2.mid') }
    testeP2R1(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/3-ritmo/R1-S2.mid')    }
    testeP2R2(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/3-ritmo/R2-S2.mid')    }
    testeP2R3(){ this.playMidiFile( this.file.dataDirectory + 'Teste/Passo-2/3-ritmo/R3-S2.mid')    }

    playMidiFile(path: string) {
        const file = this.media.create(path);
        try {
            file.play();
        } catch (e) {
            alert(JSON.stringify(e))
        }
        
      }
    
}



