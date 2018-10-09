import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MusicalCompositionSource } from '../../util/composition';
import { File } from '@ionic-native/file';
import { CompositionPage } from '../composition/composition';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage {

    _musicalCompositionSource: MusicalCompositionSource;
    baseFileSystem: string;
    relativePath: string;

    constructor(private file: File,public navCtrl: NavController, public navParams: NavParams) {
    }

    get musicalCompositionSource(): MusicalCompositionSource {
        return this._musicalCompositionSource;
    }

    set musicalCompositionSource(musicalCompositionSource: MusicalCompositionSource) {
        this._musicalCompositionSource = musicalCompositionSource; 
    }
 

    ionViewDidLoad() {
        this.baseFileSystem = this.navParams.get('baseFileSystem')
        this.relativePath = this.navParams.get('relativePath')
        this.musicalCompositionSource = new MusicalCompositionSource(this.file);
        this.musicalCompositionSource.buildSourceOptions(this.baseFileSystem, this.relativePath);
    }

    save() {        
        this.musicalCompositionSource.buildSource(this.baseFileSystem, this.relativePath).then(() => {
            this.navCtrl.setRoot(CompositionPage, {
                compositionSource: this.musicalCompositionSource
            });
        });
    }

}
