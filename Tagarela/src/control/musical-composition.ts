import { MusicalComposition, MusicalCompositionOption, MusicalCompositionLine } from '../model/musical-composition';
import { MusicalCompositionConfig } from '../model/musical-composition-config';
import { MusicalCompositionSource } from '../model/musical-composition-source';

export class MusicalCompositionControl {

    public composition: MusicalComposition;
    
    //composition control
    private _stepIndex: number;
    private _lineIndex: number;

    public optionsMap: Map<number, Map<number, MusicalCompositionOption[]>>;

    constructor(config: MusicalCompositionConfig, source: MusicalCompositionSource) {
        this.composition = new MusicalComposition();
        this.composition.config = config;
        this.composition.source = source;
        
        //indexes
        this.stepIndex = 0;
        this.lineIndex = 0;

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
        if (this.optionsMap.has(this.stepIndex) && this.optionsMap.get(this.stepIndex).has(this.lineIndex)) {
            return this.optionsMap.get(this.stepIndex).get(this.lineIndex)
        }
        return [];
    }

    public generateCompositionMidi() {
        this.composition.generateCompositionMidi();
    }

    get stepIndex(): number {
        return this._stepIndex;
    }
    
    set stepIndex(stepIndex:number) {
        this._stepIndex = stepIndex;
    }
    
    get lineIndex(): number {
        return this._lineIndex;
    }
    
    set lineIndex(lineIndex:number) {
        this._lineIndex = lineIndex;
    }


    public applyLineChanges(line: MusicalCompositionLine) {
        this.composition.applyLineChanges(line);
    }

    public applyOptionChanges(option: MusicalCompositionOption) {
        this.composition.applyOptionChanges(option);
    }

    public applyChoice(option: MusicalCompositionOption){
        this.composition.lines[this.lineIndex].options.push(option);
        this.composition.lines[this.lineIndex].applyMidiChanges();
        this.composition.lines[this.lineIndex].setNoteLimits();

        this.lineIndex++;
        if (this.lineIndex >= this.composition.lines.length) {
            this.lineIndex = 0;
            this.stepIndex++;
        }
    }

    public undoChoice() {
        if (this.lineIndex > 0 || this.stepIndex > 0) {
            this.lineIndex--;
            if (this.lineIndex < 0) {
                this.lineIndex = this.composition.lines.length -1;
                this.stepIndex--;
            }
            this.composition.lines[this.lineIndex].options.pop();
        }
    }

    public compositionHasStarted(): boolean {
        return this.stepIndex > 0 || this.lineIndex > 0;
    }

    public compositionHasEnded(): boolean {
        return this.stepIndex > this.composition.source.stepsSource.length -1
    }

}
