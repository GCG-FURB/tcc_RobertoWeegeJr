import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { SetupCompositionSourcePage } from '../setup-composition-source/setup-composition-source';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { Platform } from 'ionic-angular';
import { ListPopoverComponent } from '../../components/list-popover/list-popover';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { GenericComponent } from '../../control/generic-component';
import { FileProvider } from '../../providers/file/file';
import { Device } from '@ionic-native/device';

@Component({
    selector: 'page-choice-composition-source',
    templateUrl: 'choice-composition-source.html',
})
export class ChoiceCompositionSourcePage extends GenericComponent {
    
    //variaveis locais
    private _defaultCompositionSources: string[]; 
    private _customCompositionSources: string[]; 
    private _customCompositionSystemFileSystem: string;

    constructor(private plataform: Platform, 
                private navCtrl: NavController, 
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private fileProvider: FileProvider,
                private toastCtrl: ToastController,
                private dev: Device) { 

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl,
              dev);
    }

    //gets e sets - variaveis locais
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

    private ngOnInit(): void {
        //alert('não, aqui')
        try {
            if (this.plataform.is('android')) {
                this.customCompositionSystemFileSystem = this.fileProvider.getExternalRootDirectory();
            } else if (this.plataform.is('ios')) {
                this.customCompositionSystemFileSystem = this.fileProvider.getDocumentsDirectory();
            } else {
                throw new Error('plataforma não suportada')
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private async chooseDefaultCompositionSource(): Promise<void> {
        try {

            await this.createLoading('Buscando Dados de Composição');

            this.defaultCompositionSources = null;

            this.defaultCompositionSources = await this.fileProvider.getListOfDirectories(
                                                        this.fileProvider.getApplicationDirectory(), 
                                                        MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH
                                                   );

            let callbackFunction = this.getCompositionSetupFunction (
                                        false, 
                                        this.fileProvider.getApplicationDirectory(), 
                                        MusicalCompositionConfigControl.DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH
                                   );

            await this.dismissLoading();

            if (this.defaultCompositionSources && this.defaultCompositionSources.length > 0) {
                this.startPopover(
                    ListPopoverComponent, 
                    {
                        title: 'Dados de Composição',
                        list: this.defaultCompositionSources,
                        callback: callbackFunction.bind(this)
                    }
                );
            } else {
                await this.startAlert(
                    {
                        title: 'Nenhum Dado Encontrado',
                        subTitle: 'Nenhum dado padrão de composição foi encontrado.',
                        buttons: ['OK']
                    }
                );
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private async chooseCustomCompositionSource(): Promise<void> {
        try {

            await this.createLoading('Buscando Dados de Composição');

            this.customCompositionSources = null;
        
            //load custom composition sources
            if (await this.fileProvider.verifyDir(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH)) {
                this.customCompositionSources = await this.fileProvider.getListOfDirectories(this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH);
            } 

            let callbackFunction = this.getCompositionSetupFunction(true, this.customCompositionSystemFileSystem, MusicalCompositionConfigControl.CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH);

            await this.dismissLoading();

            if (this.customCompositionSources && this.customCompositionSources.length > 0) {
                this.startPopover(
                    ListPopoverComponent, 
                    {
                        title: 'Dados de Composição',
                        list: this.customCompositionSources,
                        callback: callbackFunction.bind(this)
                    }
                );
            } else {
                await this.startAlert(
                    {
                        title: 'Nenhum Dado Encontrado',
                        subTitle: 'Nenhum dado personalizado de composição foi encontrado.',
                        buttons: ['OK']
                    }
                );
            }

        } catch (e) {
            this.errorHandler(e);
        }
    }

    private getCompositionSetupFunction(isCustomSource: boolean,
                                          baseFileSystem: string, 
                                          relativePath: string): Function {
        return async (chosedCompositionSource: string) => {
            try {
                await this.startCompositionSetup(chosedCompositionSource, isCustomSource, baseFileSystem, relativePath);
            } catch (e) {
                this.errorHandler(e);
            }
        }
    }

    private async startCompositionSetup(chosedDefaultCompositionSource: string, 
                                        isCustomSource: boolean,
                                        baseFileSystem: string, 
                                        relativePath: string): Promise<void> {
            
        await this.createLoading('Carregando Dados de Composição');

        let configControl: MusicalCompositionConfigControl = new MusicalCompositionConfigControl(
                                                                    this.fileProvider, 
                                                                    baseFileSystem, 
                                                                    relativePath + chosedDefaultCompositionSource, 
                                                                    isCustomSource
                                                                );
        
        let sourceControl: MusicalCompositionSourceControl = new MusicalCompositionSourceControl(this.fileProvider, baseFileSystem);
        
        await configControl.loadConfigs();
        await sourceControl.loadSources(configControl.config);
        await configControl.loadSavedConfigs(); 
        await configControl.determinateMidiChannelsAttributesValues(sourceControl.source);
        await configControl.setTempoAndKeySignatureValues(sourceControl.source);
        await configControl.normalizeTimeDivision(sourceControl.source);
        await this.dismissLoading();

        this.navCtrl.setRoot(SetupCompositionSourcePage, {
            isCustomSource: isCustomSource,
            baseFileSystem: baseFileSystem,
            relativePath: relativePath,
            configControl: configControl,
            sourceControl: sourceControl
        });
    }

}
