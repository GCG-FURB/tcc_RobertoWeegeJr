import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage {
    
    private compositionPath: string;
    
    constructor(public navCtrl: NavController, public navParams: NavParams , private file: File,  private filePath: FilePath) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CompositionPage');
        this.compositionPath = this.file.dataDirectory + 'Teste/'
        this.listCompositionData();
    }

    listCompositionData(){
        alert(this.file.dataDirectory)
        alert(this.compositionPath)

        /*this.filePath.resolveNativePath(this.file.dataDirectory).then((a)=>{
            alert(JSON.stringify(a))
        }).catch((e) => {alert(JSON.stringify(e))});

        this.filePath.resolveNativePath(this.file.externalDataDirectory).then((a)=>{
            alert(JSON.stringify(a))
        }).catch((e) => {alert(JSON.stringify(e))});*/

        this.file.listDir(this.file.dataDirectory + 'files/Teste3/', '').then((a)=>{
            for (let obj of a) {
                alert(JSON.stringify(obj))
            }
        }).catch((e) => {alert(JSON.stringify(e))});
    }




}
