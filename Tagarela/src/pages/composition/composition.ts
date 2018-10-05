import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Media } from '@ionic-native/media';
import { MusicalCompositionSource, MusicalCompositionStep } from '../../util/composition';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage {
    
    private compositionPath: string;
    private musicalCompositionSource: MusicalCompositionSource;
    private compositionStep: MusicalCompositionStep;

    constructor(public navCtrl: NavController, public navParams: NavParams , private file: File,  private filePath: FilePath,
                private media: Media) {
        this.loadMidiFiles();
    }

    private async loadMidiFiles(){
        this.musicalCompositionSource = new MusicalCompositionSource(this.file); 
        this.musicalCompositionSource.buildSource(this.file.dataDirectory, 'Teste').then(()=>{
            this.compositionStep = this.musicalCompositionSource.rootStep;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CompositionPage');
        this.compositionPath = this.file.dataDirectory + 'Teste/'
        this.listCompositionData();
    }

    listCompositionData(){
        //alert(this.file.dataDirectory)
        //alert(this.compositionPath)

        //alert('vai!')
        /*this.filePath.resolveNativePath(this.file.dataDirectory).then((a)=>{
            alert(JSON.stringify(a))
        }).catch((e) => {alert(JSON.stringify(e))});

        this.filePath.resolveNativePath(this.file.externalDataDirectory).then((a)=>{
            alert(JSON.stringify(a))
        }).catch((e) => {alert(JSON.stringify(e))});*/

        /*this.file.listDir(this.file.dataDirectory, '').then((a)=>{
            alert(JSON.stringify(a))
            for (let obj of a) {
                alert(JSON.stringify(obj))
            }
        }).catch((e) => {alert(JSON.stringify(e))});

        alert('vai!')
*/
        /*this.file.listDir(this.file.dataDirectory, 'Teste/Passo-1').then((a)=>{
            alert(JSON.stringify(a))
            for (let obj of a) {
                alert(JSON.stringify(obj))
            }
        }).catch((e) => {alert(JSON.stringify(e))});*/

       

    }

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
        
        //alert(JSON.stringify(fu));

        /*let fileUtil: FileUtil = new FileUtil(this.file);
        fileUtil.getListOfDirectories(this.file.dataDirectory, 'Teste').then(a => {alert(a)});*/
        
        /*this.file.createDir(this.file.dataDirectory, 'Teste', false)
            .then((e) => {
                this.file.createDir(this.file.dataDirectory + 'Teste/', 'Passo-1', false)
                .then((e) => {
                    this.file.createDir(this.file.dataDirectory + 'Teste/', 'Passo-2', false)
                    .then((e) => {
                        this.file.createDir(this.file.dataDirectory + 'Teste/Passo-1/', '1-melodia', false)
                        .then((e) => {
                            this.file.createDir(this.file.dataDirectory + 'Teste/Passo-1/', '2-harmonia', false)
                            .then((e) => {
                                this.file.createDir(this.file.dataDirectory + 'Teste/Passo-1/', '3-ritmo', false)
                                .then((e) => {
                                    this.file.createDir(this.file.dataDirectory + 'Teste/Passo-2/', '1-melodia', false)
                                    .then((e) => {
                                        this.file.createDir(this.file.dataDirectory + 'Teste/Passo-2/', '2-harmonia', false)
                                        .then((e) => {
                                            this.file.createDir(this.file.dataDirectory + 'Teste/Passo-2/', '3-ritmo', false)
                                            .then((e) => {
                                                
                                                
                                            })
                                            .catch((e) => {alert(JSON.stringify(e))});
                                    
                                            
                                        })
                                        .catch((e) => {alert(JSON.stringify(e))});
                                
                                        
                                    })
                                    .catch((e) => {alert(JSON.stringify(e))});
                            
                                    
                                })
                                .catch((e) => {alert(JSON.stringify(e))});
                        
                                
                            })
                            .catch((e) => {alert(JSON.stringify(e))});
                    
                            
                        })
                        .catch((e) => {alert(JSON.stringify(e))});
                
                        
                    })
                    .catch((e) => {alert(JSON.stringify(e))});
            
                    
                })
                .catch((e) => {alert(JSON.stringify(e))});
        
                
            })
            .catch((e) => {alert(JSON.stringify(e))});*/
    
        //const file = this.media.create(this.file.externalRootDirectory + '/Download/' + 'testenew2.mid');
        /*this.file.createDir(this.file.dataDirectory + 'teeeste/teeeste/teeeste/', 'teeeste1', false)
            .then((e) => {alert(JSON.stringify(e))})
            .catch((e) => {alert(JSON.stringify(e))});
        this.file.createDir(this.file.dataDirectory + 'teeeste/teeeste/teeeste/', 'teeeste2', false)
            .then((e) => {alert(JSON.stringify(e))})
            .catch((e) => {alert(JSON.stringify(e))});   
        this.file.createDir(this.file.dataDirectory + 'teeeste/teeeste/teeeste/', 'teeeste3', false)
            .then((e) => {alert(JSON.stringify(e))})
            .catch((e) => {alert(JSON.stringify(e))});
        */
        //alert(path)
        /*const file = this.media.create(path);
        try {
            file.play();
        } catch (e) {
            alert(JSON.stringify(e))
        }*/
        
      }
    
}



