import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SetupCompositionSourcePage } from '../setup-composition-source/setup-composition-source';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { Platform } from 'ionic-angular';
import { FileUtil } from '../../util/file';
import { ListPopoverComponent } from '../../components/list-popover/list-popover';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';

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
                private navCtrl: NavController, 
                private loadingController: LoadingController,
                private file: File,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController) {}

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

    ionViewDidLoad() {
        this.fileUtil = new FileUtil(this.file);
        if (this.plataform.is('android')) {
            this.customCompositionSystemFileSystem = this.file.externalRootDirectory;
        } else if (this.plataform.is('ios')) {
            this.customCompositionSystemFileSystem = this.file.documentsDirectory;
        } else {
            throw new Error('plataforma não suportada')
        }
        //this.loadCompositionOptions();
    }

    private async chooseDefaultCompositionSource() {
        let loading = await this.loadingController.create({content: 'Buscando Dados de Composição'});
        loading.present();
        try {
            
            this.defaultCompositionSources = null;

            //load default composition sources
            this.defaultCompositionSources = await this.fileUtil.getListOfDirectories(this.file.applicationDirectory, MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH);
            
            loading.dismiss();

            if (this.defaultCompositionSources && this.defaultCompositionSources.length > 0) {
                const popover = this.popoverCtrl.create(ListPopoverComponent, 
                    {
                        title: 'Dados de Composição',
                        list: this.defaultCompositionSources,
                        callback: this.startDefaultCompositionSetup.bind(this)
                    });
                popover.present();
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Nenhum Dado Encontrado',
                    subTitle: 'Nenhum dado padrão de composição foi encontrado.',
                    buttons: ['OK']
                });
                alert.present();
            }
        } catch (e) {
            loading.dismiss();
            alert('error')
            alert(JSON.stringify(e))
        }
    }

    private async chooseCustomCompositionSource() {
        let loading = await this.loadingController.create({content: 'Buscando Dados de Composição'});
        loading.present();
        try {
            this.customCompositionSources = null;
        
            //load custom composition sources
            if (await this.fileUtil.verifyDir(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH)) {
                //await this.fileUtil.verifyAndCreateDirs(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH)
                this.customCompositionSources = await this.fileUtil.getListOfDirectories(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH);
            } 
            this.customCompositionSources = null;
            
            loading.dismiss();

            if (this.customCompositionSources && this.customCompositionSources.length > 0) {
                const popover = this.popoverCtrl.create(ListPopoverComponent, 
                            {
                                title: 'Dados de Composição',
                                list: this.customCompositionSources,
                                callback: this.startCustomCompositionSetup.bind(this)
                            });
                popover.present();
                
            } else {
                const alert = this.alertCtrl.create({
                    title: 'Nenhum Dado Encontrado',
                    subTitle: 'Nenhum dado personalizado de composição foi encontrado.',
                    buttons: ['OK']
                });
                alert.present();
            }
            
        } catch (e) {
            loading.dismiss();
            alert('error')
            alert(JSON.stringify(e))
        }
    }

    private async startDefaultCompositionSetup(chosedDefaultCompositionSource: string) {
        let loading = await this.loadingController.create({content: 'Carregando Dados de Composição'});
        loading.present();
        try {
            
            let configControl: MusicalCompositionConfigControl = new MusicalCompositionConfigControl(this.file, this.file.applicationDirectory, MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH + chosedDefaultCompositionSource, false);
            await configControl.loadConfigs();

            let sourceControl: MusicalCompositionSourceControl = new MusicalCompositionSourceControl(this.file, this.file.applicationDirectory);
            await sourceControl.loadSources(configControl.config);

            await configControl.determinateMidiChannels(sourceControl.source);
            loading.dismiss();

            this.navCtrl.setRoot(SetupCompositionSourcePage, {
                isCustomSource: false,
                baseFileSystem: this.file.applicationDirectory,
                relativePath: MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH + chosedDefaultCompositionSource,
                configControl: configControl,
                sourceControl: sourceControl
            });

        } catch (e) {
            loading.dismiss();
            alert('aqui')
            alert(JSON.stringify(e))
        }

    }

    private async startCustomCompositionSetup(chosedDefaultCompositionSource: string) {
        let loading = await this.loadingController.create({content: 'Carregando Dados de Composição'});
        loading.present();
        try {
            
            let configControl: MusicalCompositionConfigControl = new MusicalCompositionConfigControl(this.file, this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH + chosedDefaultCompositionSource, true);
            await configControl.loadConfigs();

            let sourceControl: MusicalCompositionSourceControl = new MusicalCompositionSourceControl(this.file, this.customCompositionSystemFileSystem);
            await sourceControl.loadSources(configControl.config);

            await configControl.determinateMidiChannels(sourceControl.source);
            loading.dismiss();
            this.navCtrl.setRoot(SetupCompositionSourcePage, {
                isCustomSource: true,
                baseFileSystem: this.customCompositionSystemFileSystem,
                relativePath: MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH + chosedDefaultCompositionSource,
                configControl: configControl,
                sourceControl: sourceControl
            });
        } catch (e) {
            loading.dismiss();
            alert('aqui')
            alert(JSON.stringify(e))
        }
    }

}
