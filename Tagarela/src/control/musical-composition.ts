import { MusicalComposition, MusicalCompositionOption, MusicalCompositionLine } from '../model/musical-composition';
import { MusicalCompositionConfig } from '../model/musical-composition-config';
import { MusicalCompositionSource } from '../model/musical-composition-source';

export class MusicalCompositionControl {

    public composition: MusicalComposition;
    
    public optionsMap: Map<number, Map<number, MusicalCompositionOption[]>>;

    constructor(config: MusicalCompositionConfig, source: MusicalCompositionSource) {
        this.composition = new MusicalComposition();
        this.composition.config = config;
        this.composition.source = source;
        
        //key signature
        this.composition.keySignature = 0;
    
        //tempo
        this.composition.minTempo = config.minTempo;
        this.composition.maxTempo = config.maxTempo;
        this.composition.stepTempo = config.stepTempo;
        this.composition.tempo = config.defaultTempo;

        //lines
        for(let line of config.linesConfig){
            let newLine: MusicalCompositionLine = new MusicalCompositionLine();
            newLine.name = line.name;
            newLine.minVolume = line.minVolume;
            newLine.maxVolume = line.maxVolume;
            newLine.stepVolume = line.stepVolume;
            newLine.volume = line.defaultVolume;
            this.composition.lines.push(newLine);
        }

        //optionsMap
        this.optionsMap = new Map();
        this.populateOptionsMap();

    }

    private populateOptionsMap() {
        for(let i = 0; i < this.composition.config.stepsConfig.length; i++){
            let optionMap: Map<number, MusicalCompositionOption[]> = new Map();
            for(let j = 0; j < this.composition.config.stepsConfig[i].groupsConfig.length; j++) {
                let options: MusicalCompositionOption[] = this.composition.getOptionsToChoice(i, j);
                optionMap.set(j, options);
            }
            this.optionsMap.set(i, optionMap);
        }
    }

    public getOptionsToChoice(): MusicalCompositionOption[] {
        if (this.optionsMap.has(this.composition.stepIndex) && this.optionsMap.get(this.composition.stepIndex).has(this.composition.lineIndex)) {
            return this.optionsMap.get(this.composition.stepIndex).get(this.composition.lineIndex)
        }
        return [];
    }

    public generateCompositionMidi() {
        this.composition.generateCompositionMidi();
    }

    public applyLineChanges(line: MusicalCompositionLine) {
        this.composition.applyLineChanges(line);
    }

    public applyOptionChanges(option: MusicalCompositionOption) {
        this.composition.applyOptionChanges(option);
    }

    public applyChoice(option: MusicalCompositionOption){
        this.composition.applyChoice(option);
    }

    public undoChoice() {
        this.composition.undoChoice();
    }

    public compositionHasStarted(): boolean {
        return this.composition.stepIndex > 0 || this.composition.lineIndex > 0;
    }

    public compositionHasEnded(): boolean {
        return this.composition.stepIndex > this.composition.source.stepsSource.length -1
    }

}
