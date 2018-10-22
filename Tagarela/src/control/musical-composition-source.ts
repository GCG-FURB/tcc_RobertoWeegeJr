import { MusicalCompositionSource, MusicalCompositionStepSource, MusicalCompositionGroupSource, MusicalCompositionOptionSource } from "../model/musical-composition-source";
import { MusicalCompositionConfig } from '../model/musical-composition-config';
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

        let midi: Midi;
        let fullOptionPath: string;
        let midiFile: string;

        //steps
        for (let step of config.stepsConfig) {
            stepSource = new MusicalCompositionStepSource();
            stepSource.relativePath = step.relativePath;
            //groups
            for (let group of step.groupsConfig) {
                groupSource = new MusicalCompositionGroupSource();
                groupSource.relativePath = group.relativePath;
                //options
                for (let option of group.optionsConfig) {
                    optionSource = new MusicalCompositionOptionSource();
                    optionSource.fileName = option.fileName;
                    fullOptionPath = this.fileProvider.concatenatePaths([this.baseFileSystem, config.relativePath, step.relativePath, group.relativePath]);
                    midiFile = await this.fileProvider.readFileAsBinaryString(fullOptionPath, option.fileName);
                    try {
                        midi = this.midiControl.setupMidiFromFile(midiFile, lastMidi);
                    } catch (e) {
                        throw Error(`Ocorreu um erro ao criar o Midi. Caminho: ${fullOptionPath} Arquivo: ${option.fileName} { ${(e && e.message ? e.message : 'null' )}}.`);
                    }
                    optionSource.midi = midi
                    lastMidi = midi;
                    groupSource.optionsSource.push(optionSource);
                }
                stepSource.groupsSource.push(groupSource);
            }
            source.stepsSource.push(stepSource);
        }
        this.source = source;
    }
    
}
