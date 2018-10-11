import { MusicalCompositionConfig, MusicalCompositionStepConfig, MusicalCompositionGroupConfig, MusicalCompositionOptionConfig, MusicalCompositionLineConfig } from "../model/musical-composition-config";
import { File } from '@ionic-native/file';
import { FileUtil } from "../util/file";

export class MusicalCompositionConfigControl {

    public static COMPOSITION_SOURCES_RELATIVE_PATH: string = 'www/assets/composition-sources/'

    private CONTROL_DEFAULT_MIN_TEMPO: number = 40 
    private CONTROL_DEFAULT_MAX_TEMPO: number = 240
    private CONTROL_DEFAULT_STEP_TEMPO: number = 1
    private CONTROL_DEFAULT_DEFAULT_TEMPO: number = 120

    private CONTROL_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED: number[] = [0, 56]
    private CONTROL_DEFAULT_DEFAULT_MUSICAL_INSTRUMENT: number = 0

    private CONTROL_DEFAULT_MIN_VOLUME: number = 0 
    private CONTROL_DEFAULT_MAX_VOLUME: number = 200
    private CONTROL_DEFAULT_STEP_VOLUME: number = 10
    private CONTROL_DEFAULT_DEFAULT_VOLUME: number = 100

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
            config.minTempo = this.CONTROL_DEFAULT_MIN_TEMPO;
            config.maxTempo = this.CONTROL_DEFAULT_MAX_TEMPO;
            config.stepTempo = this.CONTROL_DEFAULT_STEP_TEMPO;
            config.defaultTempo = this.CONTROL_DEFAULT_DEFAULT_TEMPO;
        
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
                        optionConfig.musicalInstrumentsAllowed = this.CONTROL_DEFAULT_MUSICAL_INSTRUMENTS_ALLOWED;
                        optionConfig.defaultMusicalInstrument = this.CONTROL_DEFAULT_DEFAULT_MUSICAL_INSTRUMENT;
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
                        lineConfig.minVolume = this.CONTROL_DEFAULT_MIN_VOLUME;
                        lineConfig.maxVolume = this.CONTROL_DEFAULT_MAX_VOLUME;
                        lineConfig.stepVolume = this.CONTROL_DEFAULT_STEP_VOLUME;
                        lineConfig.defaultVolume = this.CONTROL_DEFAULT_DEFAULT_VOLUME;
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

}
