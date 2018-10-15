import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController  } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { CompositionPage } from '../composition/composition';
import { VisualMidiUtil } from '../../util/visual-midi';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage {

    private _configControl: MusicalCompositionConfigControl;
    private _sourceControl: MusicalCompositionSourceControl;

    private _visualMidi: VisualMidiUtil;
    
    private _configSegment: string;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingController: LoadingController,
                private file: File) {}

    get configControl(): MusicalCompositionConfigControl {
        return this._configControl;
    }
    
    set configControl(configControl:MusicalCompositionConfigControl) {
        this._configControl = configControl;
    }
    
    get sourceControl(): MusicalCompositionSourceControl {
        return this._sourceControl;
    }
    
    set sourceControl(sourceControl:MusicalCompositionSourceControl) {
        this._sourceControl = sourceControl;
    }
    
    get visualMidi(): VisualMidiUtil {
        return this._visualMidi;
    }
    
    set visualMidi(visualMidi:VisualMidiUtil) {
        this._visualMidi = visualMidi;
    }
         
    get configSegment(): string {
        return this._configSegment;
    }
    
    set configSegment(configSegment:string) {
        this._configSegment = configSegment;
    }

    ionViewDidLoad() {
        this.visualMidi = new VisualMidiUtil();
        this.configSegment = 'general';
        this.loadConfigs();
    }

    private async loadConfigs(){
        let loading = await this.loadingController.create({content: 'Carregando dados de composição'});
        loading.present();
        try {
            
            let configControl: MusicalCompositionConfigControl = new MusicalCompositionConfigControl(this.file, this.navParams.get('baseFileSystem'), this.navParams.get('relativePath'), this.navParams.get('isCustomSource'));
            await configControl.loadConfigs();

            let sourceControl: MusicalCompositionSourceControl = new MusicalCompositionSourceControl(this.file, this.navParams.get('baseFileSystem'));
            await sourceControl.loadSources(configControl.config);

            await configControl.determinateMidiChannels(sourceControl.source);

            this.configControl = configControl;
            this.sourceControl = sourceControl;

            loading.dismiss();

        } catch (e) {
            loading.dismiss();
            alert('aqui')
            alert(JSON.stringify(e))
        }
    }

    private async saveConfigAndStartComposition() {    
        await this.configControl.persistConfig();
        this.navCtrl.setRoot(CompositionPage, {
            compositionConfig: this.configControl.config,
            compositionSource: this.sourceControl.source
        }); 
    }

}