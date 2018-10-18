import { MusicalCompositionSource, MusicalCompositionStepSource, MusicalCompositionGroupSource, MusicalCompositionOptionSource } from "../model/musical-composition-source";
import { MusicalCompositionConfig } from '../model/musical-composition-config';
import { Midi } from './midi';
import { FileProvider } from '../providers/file/file';

export class MusicalCompositionSourceControl {

    private _fileProvider: FileProvider;

    private _source: MusicalCompositionSource;

    private _baseFileSystem: string;

    constructor(fileProvider: FileProvider, baseFileSystem: string){
        this.fileProvider = fileProvider;
        this.baseFileSystem = baseFileSystem;
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
    
    public async loadSources(config: MusicalCompositionConfig){
        let source = new MusicalCompositionSource();
        //steps
        for (let step of config.stepsConfig) {
            let stepSource: MusicalCompositionStepSource = new MusicalCompositionStepSource();
            stepSource.relativePath = step.relativePath;
            //groups
            for (let group of step.groupsConfig) {
                let groupSource: MusicalCompositionGroupSource = new MusicalCompositionGroupSource();
                groupSource.relativePath = group.relativePath;
                //options
                for (let option of group.optionsConfig) {
                    let optionSource: MusicalCompositionOptionSource = new MusicalCompositionOptionSource();
                    optionSource.fileName = option.fileName;

                    let fullOptionPath: string = this.fileProvider.concatenatePaths([this.baseFileSystem, config.relativePath, step.relativePath, group.relativePath]);
                    let midiFile: string = await this.fileProvider.readFileAsBinaryString(fullOptionPath, option.fileName);
                    let midi = new Midi();
                    midi.setupMidiFromFile(midiFile);
                    optionSource.midi = midi;

                    groupSource.optionsSource.push(optionSource);
                }
                stepSource.groupsSource.push(groupSource);
            }
            source.stepsSource.push(stepSource);
        }
        this.source = source;
    }
}
