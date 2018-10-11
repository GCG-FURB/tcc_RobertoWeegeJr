import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { CompositionPage } from '../composition/composition';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage {

    //_musicalCompositionSource: MusicalCompositionSource;
    baseFileSystem: string;
    relativePath: string;

    configControl: MusicalCompositionConfigControl;

    constructor(private file: File,public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.baseFileSystem = this.navParams.get('baseFileSystem')
        this.relativePath = this.navParams.get('relativePath')
        this.configControl = new MusicalCompositionConfigControl(this.file);
        this.configControl.loadConfigs(this.baseFileSystem, this.relativePath);
    }

    save() {        
        let sourceControl: MusicalCompositionSourceControl = new MusicalCompositionSourceControl(this.file);
        sourceControl.loadSources(this.baseFileSystem, this.configControl.config).then(() => {
            let compositionControl: MusicalCompositionControl = new MusicalCompositionControl(this.configControl.config, sourceControl.source);
            this.navCtrl.setRoot(CompositionPage, {
                compositionControl: compositionControl
            }); 
        })
        


    }

}
