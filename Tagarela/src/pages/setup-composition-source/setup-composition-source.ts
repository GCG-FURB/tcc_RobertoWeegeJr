import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { CompositionPage } from '../composition/composition';
import { VisualMidiUtil } from '../../util/visual-midi';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage {

    baseFileSystem: string;
    relativePath: string;

    configControl: MusicalCompositionConfigControl;
    sourceControl: MusicalCompositionSourceControl;

    visualMidi: VisualMidiUtil = new VisualMidiUtil();
    
    setupControl: boolean;

    constructor(private file: File,public navCtrl: NavController, public navParams: NavParams) {    }

    ionViewDidLoad() {
        this.baseFileSystem = this.navParams.get('baseFileSystem')
        this.relativePath = this.navParams.get('relativePath')
        this.configControl = new MusicalCompositionConfigControl(this.file);
        this.configControl.loadConfigs(this.baseFileSystem, this.relativePath).then(() => {
            this.sourceControl = new MusicalCompositionSourceControl(this.file);
            this.sourceControl.loadSources(this.baseFileSystem, this.configControl.config).then(() => {
                this.configControl.determinateMidiChannels(this.sourceControl.source);
                this.setupControl = true;
            });
        });
    }

    async save() {    
        await this.configControl.persistConfig(this.file.dataDirectory, this.relativePath);
        let compositionControl: MusicalCompositionControl = new MusicalCompositionControl(this.configControl.config, this.sourceControl.source);
        this.navCtrl.setRoot(CompositionPage, {
            compositionControl: compositionControl
        }); 
    }

}
