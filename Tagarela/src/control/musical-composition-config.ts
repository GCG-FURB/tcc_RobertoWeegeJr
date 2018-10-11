import { MusicalCompositionConfig, MusicalCompositionStepConfig, MusicalCompositionGroupConfig, MusicalCompositionOptionConfig, MusicalCompositionLineConfig } from "../model/musical-composition-config";
import { File } from '@ionic-native/file';
import { FileUtil } from "../util/file";
import { MusicalCompositionSource } from "../model/musical-composition-source";
import { MidiConstants } from "../model/midi";

export class MusicalCompositionConfigControl {

    public static COMPOSITION_SOURCES_RELATIVE_PATH: string = 'www/assets/composition-sources/'

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

    public config: MusicalCompositionConfig;
    fileUtil: FileUtil;

    constructor(file: File){
        this.fileUtil = new FileUtil(file);
    }

    public async loadConfigs(devicePath: string, relativePath: string){
        try {

            let config = new MusicalCompositionConfig()

            //set default values
            config.relativePath = relativePath;
            config.minTempo = this.CONFIG_DEFAULT_MIN_TEMPO;
            config.maxTempo = this.CONFIG_DEFAULT_MAX_TEMPO;
            config.stepTempo = this.CONFIG_DEFAULT_STEP_TEMPO;
            config.defaultTempo = this.CONFIG_DEFAULT_DEFAULT_TEMPO;
        
            let stepDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(devicePath, relativePath);
            //steps
            for (let stepDirectory of stepDirectoriesList) {
                let stepConfig: MusicalCompositionStepConfig = new MusicalCompositionStepConfig();
                stepConfig.relativePath = stepDirectory; 

                let stepPath: string = this.fileUtil.concatenatePath(relativePath, stepDirectory);
                let lineDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(devicePath, stepPath);

                //groups
                for (let groupDirectory of lineDirectoriesList) {
                    let groupConfig: MusicalCompositionGroupConfig = new MusicalCompositionGroupConfig();
                    groupConfig.relativePath = groupDirectory;

                    let linePath: string = this.fileUtil.concatenatePath(stepPath, groupDirectory);
                    let optionFilesList: string[] = await this.fileUtil.getListOfFiles(devicePath, linePath)

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

            //ler arquivo existente 
            //verificar consistência
            //carregar dados salvos anteriormente

            this.config = config;
        } catch (e) {
            alert('error')
            alert(JSON.stringify(e));
        }

    }

    public determinateMidiChannels(source: MusicalCompositionSource) {
        for (let i = 0; i < this.config.stepsConfig.length; i++) {
            for (let j = 0; j < this.config.stepsConfig[i].groupsConfig.length; j++) {
                for (let k = 0; k < this.config.stepsConfig[i].groupsConfig[j].optionsConfig.length; k++) {
                    let channels: string[] = source.stepsSource[i].groupsSource[j].optionsSource[k].midi.getAllUsedChannels();
                    if (channels.length > 1 || channels.length == 0) {
                        throw Error('Cada midi deve possuir somente um canal');
                    }
                    if (MidiConstants.DRUMS_MIDI_CHANNELS.indexOf(channels[0]) >= 0) {
                        this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed = this.CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED;
                        this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed = this.CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED;
                        this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument = this.CONFIG_DEFAULT_DRUMS_MUSICAL_INSTRUMENTS_ALLOWED[0];
                    } else {
                        this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed = this.CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED;
                        this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].baseMusicalInstrumentsAllowed = this.CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED;
                        this.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument = this.CONFIG_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED[0];
                    }
                }
            }
        }
    };

}
