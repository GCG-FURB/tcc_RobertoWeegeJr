import { MusicalCompositionSource, MusicalCompositionStepSource, MusicalCompositionGroupSource, MusicalCompositionOptionSource } from "../model/musical-composition-source";
import { MusicalCompositionConfig, MusicalCompositionOptionConfig } from '../model/musical-composition-config';
import { Midi } from '../model/midi';
import { FileProvider } from '../providers/file/file';
import { MidiControl } from "./midi";

export class MusicalCompositionSourceControl {

    private _fileProvider: FileProvider;
    private _source: MusicalCompositionSource;
    private _baseFileSystem: string;
    private _midiControl: MidiControl;

    constructor(fileProvider: FileProvider, baseFileSystem: string){
        this.fileProvider = fileProvider;
        this.baseFileSystem = baseFileSystem;
        this.midiControl = new MidiControl();
    }

    get fileProvider(): FileProvider {
        return this._fileProvider;
    }
    
    set fileProvider(fileUtil:FileProvider) {
        this._fileProvider = fileUtil;
    }
    
    get source(): MusicalCompositionSource {
        return this._source;
    }
    
    set source(source:MusicalCompositionSource) {
        this._source = source;
    }
    
    get baseFileSystem(): string {
        return this._baseFileSystem;
    }
    
    set baseFileSystem(baseFileSystem:string) {
        this._baseFileSystem = baseFileSystem;
    }
    
    public get midiControl(): MidiControl {
        return this._midiControl;
    }
    
    public set midiControl(value: MidiControl) {
        this._midiControl = value;
    }    
    public async loadSources(config: MusicalCompositionConfig){
        
        let source = new MusicalCompositionSource();
        let lastMidi: Midi;
        let stepSource: MusicalCompositionStepSource;
        let groupSource: MusicalCompositionGroupSource;
        let optionSource: MusicalCompositionOptionSource;

        let midis: Midi[];
        let fullOptionPath: string;
        let midiFile: string;

        let newOptionConfigs: MusicalCompositionOptionConfig[];

        //steps
        for (let step of config.stepsConfig) {
            stepSource = new MusicalCompositionStepSource();
            stepSource.relativePath = step.relativePath;
            //groups
            for (let group of step.groupsConfig) {
                newOptionConfigs = [];
                groupSource = new MusicalCompositionGroupSource();
                groupSource.relativePath = group.relativePath;
                //options
                for (let option of group.optionsConfig) {
                    
                    fullOptionPath = this.fileProvider.concatenatePaths([this.baseFileSystem, config.relativePath, step.relativePath, group.relativePath]);
                    midiFile = await this.fileProvider.readFileAsBinaryString(fullOptionPath, option.fileName);
                    
                    try {
                        midis = this.midiControl.setupMidiFromFile(midiFile, lastMidi);
                    } catch (e) {
                        throw Error(`Ocorreu um erro ao criar o Midi. Caminho: ${fullOptionPath} Arquivo: ${option.fileName} { ${(e && e.message ? e.message : 'null' )}}.`);
                    }

                    for (let i = 0; i < midis.length; i++){
                        optionSource = new MusicalCompositionOptionSource();
                        optionSource.fileName = option.fileName + (i ? ` (${i})`: '');
                        optionSource.midi = midis[i]
                        lastMidi = midis[i];
                        groupSource.optionsSource.push(optionSource);
                        if (i > 0) {
                            let optionConfig = new MusicalCompositionOptionConfig();
                            optionConfig.fileName = optionSource.fileName  
                            newOptionConfigs.push(optionConfig);
                        }
                    }
                }
                for (let option of newOptionConfigs) {
                    group.optionsConfig.push(option);
                }
                stepSource.groupsSource.push(groupSource);
            }
            source.stepsSource.push(stepSource);
        }
        this.source = source;
    }
    
}
