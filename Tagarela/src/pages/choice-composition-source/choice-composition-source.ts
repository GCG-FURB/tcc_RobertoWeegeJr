import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SetupCompositionSourcePage } from '../setup-composition-source/setup-composition-source';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { Platform } from 'ionic-angular';
import { FileUtil } from '../../util/file';

@Component({
    selector: 'page-choice-composition-source',
    templateUrl: 'choice-composition-source.html',
})
export class ChoiceCompositionSourcePage {

    private _fileUtil: FileUtil;
    
    private _defaultCompositionSources: string[]; 
    private _customCompositionSources: string[]; 

    private _customCompositionSystemFileSystem: string;

    constructor(private plataform: Platform, 
                public navCtrl: NavController, 
                public navParams: NavParams, 
                public loadingController: LoadingController,
                private file: File, ) {}

    get fileUtil(): FileUtil {
        return this._fileUtil;
    }

    set fileUtil(fileUtil: FileUtil) {
        this._fileUtil = fileUtil; 
    }

    get defaultCompositionSources(): string[] {
        return this._defaultCompositionSources;
    }

    set defaultCompositionSources(defaultCompositionSources: string[]) {
        this._defaultCompositionSources = defaultCompositionSources; 
    }

    get customCompositionSources(): string[] {
        return this._customCompositionSources;
    }

    set customCompositionSources(customCompositionSources: string[]) {
        this._customCompositionSources = customCompositionSources; 
    }
    
    get customCompositionSystemFileSystem(): string {
        return this._customCompositionSystemFileSystem;
    }

    set customCompositionSystemFileSystem(customCompositionSystemFileSystem: string) {
        this._customCompositionSystemFileSystem = customCompositionSystemFileSystem; 
    }

    set chosedDefaultCompositionSource(chosedDefaultCompositionSource: string) {
        this.navCtrl.setRoot(SetupCompositionSourcePage, {
            isCustomSource: false,
            baseFileSystem: this.file.applicationDirectory,
            relativePath: MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH + chosedDefaultCompositionSource
        });
    }

    set chosedCustomCompositionSource(chosedDefaultCompositionSource: string) {
        this.navCtrl.setRoot(SetupCompositionSourcePage, {
            isCustomSource: true,
            baseFileSystem: this.customCompositionSystemFileSystem,
            relativePath: MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH + chosedDefaultCompositionSource
        });
    }

    ionViewDidLoad() {
        this.fileUtil = new FileUtil(this.file);
        if (this.plataform.is('android')) {
            this.customCompositionSystemFileSystem = this.file.externalRootDirectory;
        } else if (this.plataform.is('ios')) {
            this.customCompositionSystemFileSystem = this.file.documentsDirectory;
        } else {
            alert('plataforma não suportada')
        }
        this.loadCompositionOptions();
    }

    private async loadCompositionOptions() {
        let loading = await this.loadingController.create({content: 'Buscando dados de composição'});
        loading.present();
        try {
            //load default composition sources
            this.defaultCompositionSources = await this.fileUtil.getListOfDirectories(this.file.applicationDirectory, MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH);
            
            //load custom composition sources
            if (await this.fileUtil.verifyDir(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH)) {
                this._customCompositionSources = await this.fileUtil.getListOfDirectories(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH);
            }
            loading.dismiss();
        } catch (e) {
            loading.dismiss();
            alert('error')
            alert(JSON.stringify(e))
        }
    }

}
