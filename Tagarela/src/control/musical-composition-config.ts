import { MusicalCompositionConfig, MusicalCompositionStepConfig, MusicalCompositionGroupConfig, MusicalCompositionOptionConfig, MusicalCompositionLineConfig } from "../model/musical-composition-config";
import { File } from '@ionic-native/file';
import { FileUtil } from "../util/file";
import { MusicalCompositionSource } from "../model/musical-composition-source";
import { MidiConstants } from "./midi";

export class MusicalCompositionConfigControl {

    //static constants
    public static DEFAULT_COMPOSITION_SOURCES_RELATIVE_PATH: string = 'www/assets/composition-sources/'
    public static CUSTOM_COMPOSITION_SOURCES_RELATIVE_PATH: string = 'Tagarela/Musicoterapia/Composicoes/'

    //private constants
    private CONFIG_FILE_NAME: string = 'config.json';

    private CONFIG_DEFAULT_MIN_TEMPO: number = 40 
    private CONFIG_DEFAULT_MAX_TEMPO: number = 240
    private CONFIG_DEFAULT_STEP_TEMPO: number = 1
    private CONFIG_DEFAULT_DEFAULT_TEMPO: number = 120

    private CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED: number[] = [0, 11, 13, 21, 24, 26, 33, 41, 46, 56, 57, 58, 65, 73, 105]
    private CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED: number[] = [999]

    private CONFIG_DEFAULT_MIN_VOLUME: number = 0 
    private CONFIG_DEFAULT_MAX_VOLUME: number = 200
    private CONFIG_DEFAULT_STEP_VOLUME: number = 10
    private CONFIG_DEFAULT_DEFAULT_VOLUME: number = 100

    //variables
    private _fileUtil: FileUtil;

    private _config: MusicalCompositionConfig;

    private _baseFileSystemComposition: string;
    private _baseFileSystemConfig: string;
    private _relativePath: string;

    constructor(file: File, baseFileSystem: string, relativePath: string, isCustomSource: boolean){
        this.fileUtil = new FileUtil(file);
        this.baseFileSystemComposition = baseFileSystem;
        this.baseFileSystemConfig = (isCustomSource ? baseFileSystem : file.dataDirectory);
        this.relativePath = relativePath;
    }

    get fileUtil(): FileUtil {
        return this._fileUtil;
    }
    
    set fileUtil(fileUtil:FileUtil) {
        this._fileUtil = fileUtil;
    }
    
    get config(): MusicalCompositionConfig {
        return this._config;
    }
    
    set config(config:MusicalCompositionConfig) {
        this._config = config;
    }
    
    get baseFileSystemComposition(): string {
        return this._baseFileSystemComposition;
    }
    
    set baseFileSystemComposition(baseFileSystemComposition:string) {
        this._baseFileSystemComposition = baseFileSystemComposition;
    }
    
    get baseFileSystemConfig(): string {
        return this._baseFileSystemConfig;
    }
    
    set baseFileSystemConfig(baseFileSystemConfig:string) {
        this._baseFileSystemConfig = baseFileSystemConfig;
    }
    
    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        this._relativePath = relativePath;
    }
    
    public async persistConfig() {
        if (!this.config) {
            throw Error('As configurações não estão carregadas');
        }
        try { 
            await this.fileUtil.writeFile(this.baseFileSystemConfig, this.relativePath, this.CONFIG_FILE_NAME, JSON.stringify(this.config));
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    public async getConfig(): Promise<string> {
        try { 
            return await this.fileUtil.getFileContentIfExists(this.baseFileSystemConfig, this.relativePath, this.CONFIG_FILE_NAME);
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    public async loadConfigs(){
        try {

            let config = new MusicalCompositionConfig()

            //set default values
            config.baseFileSystem = this.baseFileSystemComposition;
            config.relativePath = this.relativePath;
            config.minTempo = this.CONFIG_DEFAULT_MIN_TEMPO;
            config.maxTempo = this.CONFIG_DEFAULT_MAX_TEMPO;
            config.stepTempo = this.CONFIG_DEFAULT_STEP_TEMPO;
            config.defaultTempo = this.CONFIG_DEFAULT_DEFAULT_TEMPO;
        
            let stepDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(config.baseFileSystem, config.relativePath);
            //steps
            for (let stepDirectory of stepDirectoriesList) {
                let stepConfig: MusicalCompositionStepConfig = new MusicalCompositionStepConfig();
                stepConfig.relativePath = stepDirectory; 

                let stepPath: string = this.fileUtil.concatenatePath(config.relativePath, stepDirectory);
                let lineDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(config.baseFileSystem, stepPath);

                //groups
                for (let groupDirectory of lineDirectoriesList) {
                    let groupConfig: MusicalCompositionGroupConfig = new MusicalCompositionGroupConfig();
                    groupConfig.relativePath = groupDirectory;

                    let linePath: string = this.fileUtil.concatenatePath(stepPath, groupDirectory);
                    let optionFilesList: string[] = await this.fileUtil.getListOfFiles(config.baseFileSystem, linePath)

                    //options
                    for (let optionFile of optionFilesList) {
                        let optionConfig: MusicalCompositionOptionConfig = new MusicalCompositionOptionConfig();
                        optionConfig.fileName = optionFile;
                        groupConfig.optionsConfig.push(optionConfig);
                    }
                    stepConfig.groupsConfig.push(groupConfig);
                }
                config.stepsConfig.push(stepConfig)
            }
            for (let stepConfig of config.stepsConfig) {
                for (let groupConfig of stepConfig.groupsConfig) {
                    if (!(config.linesConfig.find((element) => {
                        return element.name == groupConfig.relativePath
                    }))) {
                        let lineConfig: MusicalCompositionLineConfig = new MusicalCompositionLineConfig();
                        lineConfig.name = groupConfig.relativePath;
                        lineConfig.minVolume = this.CONFIG_DEFAULT_MIN_VOLUME;
                        lineConfig.maxVolume = this.CONFIG_DEFAULT_MAX_VOLUME;
                        lineConfig.stepVolume = this.CONFIG_DEFAULT_STEP_VOLUME;
                        lineConfig.defaultVolume = this.CONFIG_DEFAULT_DEFAULT_VOLUME;
                        config.linesConfig.push(lineConfig);
                    }
                }
                if (config.linesConfig.length != stepConfig.groupsConfig.length) {
                    throw Error("Exite inconsistência entre nome ou quantidade de grupos em cada etapa de composição")
                } 
            }

            let actualConfigString = await this.getConfig();
            if (actualConfigString) {
                let actualConfig = JSON.parse(actualConfigString);
                
                if (this.validateSavedConfig(config, actualConfig)) {
                    
                    config.minTempo = +actualConfig._minTempo;
                    config.maxTempo = +actualConfig._maxTempo;
                    config.stepTempo = +actualConfig._stepTempo;
                    config.defaultTempo = +actualConfig._defaultTempo;

                    for (let i = 0; i < config.stepsConfig.length; i++) {
                        for (let j = 0; j < config.stepsConfig[i].groupsConfig.length; j++) {
                            for (let k = 0; k < config.stepsConfig[i].groupsConfig[j].optionsConfig.length; k++) {
                                config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed = actualConfig._stepsConfig[i]._groupsConfig[j]._optionsConfig[k]._baseMusicalInstrumentsAllowed.map((item) => {return parseInt(item, 10);});
                                config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument = +actualConfig._stepsConfig[i]._groupsConfig[j]._optionsConfig[k]._defaultMusicalInstrument;
                                config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed = actualConfig._stepsConfig[i]._groupsConfig[j]._optionsConfig[k]._musicalInstrumentsAllowed.map((item) => {return parseInt(item, 10);});
                            }
                        }
                    }

                    for (let i = 0; i < config.linesConfig.length; i++) {
                        config.linesConfig[i].minVolume = +actualConfig._linesConfig[i]._minVolume;
                        config.linesConfig[i].maxVolume = +actualConfig._linesConfig[i]._maxVolume;
                        config.linesConfig[i].stepVolume = +actualConfig._linesConfig[i]._stepVolume;
                        config.linesConfig[i].defaultVolume = +actualConfig._linesConfig[i]._defaultVolume;
                    }

                } else {
                    alert('deu ruim')
                }

            }
            this.config = config;
        } catch (e) {
            alert('error')
            alert(JSON.stringify(e));
        }

    }

    private validateSavedConfig(config: MusicalCompositionConfig, actualConfig: any): boolean{
        
        if (config.baseFileSystem != actualConfig._baseFileSystem || config.relativePath != actualConfig._relativePath) {
            return false;
        }

        if (config.stepsConfig.length != actualConfig._stepsConfig.length 
            || config.stepsConfig[0].groupsConfig.length != actualConfig._stepsConfig[0]._groupsConfig.length
            || config.stepsConfig[0].groupsConfig[0].optionsConfig.length != actualConfig._stepsConfig[0]._groupsConfig[0]._optionsConfig.length
            || config.linesConfig.length != actualConfig._linesConfig.length ) {
                return false;
        }
        
        for (let i = 0; i < config.stepsConfig.length; i++) {
            
            if (config.stepsConfig[i].relativePath != actualConfig._stepsConfig[i]._relativePath) {
                return false;
            }

            for (let j = 0; j < config.stepsConfig[i].groupsConfig.length; j++) {
           
                if (config.stepsConfig[i].groupsConfig[j].relativePath != actualConfig._stepsConfig[i]._groupsConfig[j]._relativePath) {
                    return false;
                }
           
                for (let k = 0; k < config.stepsConfig[i].groupsConfig[j].optionsConfig.length; k++) {
                    
                    if (config.stepsConfig[i].groupsConfig[j].optionsConfig[k].fileName != actualConfig._stepsConfig[i]._groupsConfig[j]._optionsConfig[k]._fileName) {
                        return false;
                    }

                }
            }
        }
        for (let i = 0; i < config.linesConfig.length; i++) {
            if (config.linesConfig[i].name != actualConfig._linesConfig[i]._name) {
                return false;
            }
        }

        return true;
    }

    public determinateMidiChannels(source: MusicalCompositionSource) {
        if (!this.config) {
            throw Error('As configurações não estão carregadas');
        }
        for (let i = 0; i < this.config.stepsConfig.length; i++) {
            for (let j = 0; j < this.config.stepsConfig[i].groupsConfig.length; j++) {
                for (let k = 0; k < this.config.stepsConfig[i].groupsConfig[j].optionsConfig.length; k++) {
                    let channels: string[] = source.stepsSource[i].groupsSource[j].optionsSource[k].midi.getAllUsedChannels();
                    if (channels.length > 1 || channels.length == 0) {
                        throw Error('Cada midi deve possuir somente um canal');
                    }
                    if (MidiConstants.DRUMS_MIDI_CHANNELS.indexOf(channels[0]) >= 0) {
                        if (!this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed)
                            this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed = this.CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED;

                        if (!this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed)
                            this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed = this.CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED;

                        if (!this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument)
                            this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument = this.CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED[0];
                    } else {
                        if (!this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed)
                            this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed = this.CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED;
                        
                        if (!this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed)
                            this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed = this.CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED;
                        
                        if (!this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument)
                            this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument = this.CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED[0];
                    }
                }
            }
        }
    }
}
