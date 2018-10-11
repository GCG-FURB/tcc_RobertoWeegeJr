import { File } from '@ionic-native/file';
import { FileUtil } from "../util/file";
import { MusicalCompositionSource, MusicalCompositionStepSource, MusicalCompositionGroupSource, MusicalCompositionOptionSource } from "../model/musical-composition-source";
import { MusicalCompositionConfig } from '../model/musical-composition-config';
import { Midi } from '../model/midi';

export class MusicalCompositionSourceControl {

    public source: MusicalCompositionSource;
    fileUtil: FileUtil;

    constructor(file: File){
        this.fileUtil = new FileUtil(file);
    }

    public async loadSources(devicePath: string, config: MusicalCompositionConfig){
        try {
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

                        let fullOptionPath: string = this.fileUtil.concatenatePaths([devicePath, config.relativePath, step.relativePath, group.relativePath] );
                        let midiFile: string = await this.fileUtil.readFileAsBinaryString(fullOptionPath, option.fileName);
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
        } catch (e) {
            console.log(e)
        }
    }
}
