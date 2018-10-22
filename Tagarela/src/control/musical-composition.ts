import { MusicalComposition, MusicalCompositionOption, MusicalCompositionLine } from '../model/musical-composition';
import { MusicalCompositionConfig, MusicalCompositionOptionConfig } from '../model/musical-composition-config';
import { MusicalCompositionSource, MusicalCompositionOptionSource } from '../model/musical-composition-source';
import { Midi } from '../model/midi';
import { MidiControl } from './midi';

export class MusicalCompositionControl {

    public composition: MusicalComposition;
    
    //composition control
    private _stepIndex: number;
    private _lineIndex: number;

    public midiControl: MidiControl = new MidiControl;

    public optionsMap: Map<number, Map<number, MusicalCompositionOption[]>>;

    constructor(config: MusicalCompositionConfig, source: MusicalCompositionSource) {
        
        this.composition = new MusicalComposition();
        this.composition.config = config;
        this.composition.source = source;

        this.setupDefaultValues();
        this.populateOptionsMap();

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

    private setupDefaultValues() {
        if (!this.composition.config)
            throw new Error('O objeto de configuração não pode ser nulo.');

        //indexes
        this.stepIndex = 0;
        this.lineIndex = 0;

        //key signature
        this.composition.keySignature = 0;

        //tempo
        this.composition.minTempo = this.composition.config.minTempo;
        this.composition.maxTempo = this.composition.config.maxTempo;
        this.composition.stepTempo = this.composition.config.stepTempo;
        this.composition.tempo = this.composition.config.defaultTempo;

        //lines
        for(let line of this.composition.config.linesConfig){
            let newLine: MusicalCompositionLine = new MusicalCompositionLine();
            newLine.name = line.name;
            newLine.minVolume = line.minVolume;
            newLine.maxVolume = line.maxVolume;
            newLine.stepVolume = line.stepVolume;
            newLine.volume = line.defaultVolume;
            this.composition.lines.push(newLine);
        }
    }

    private populateOptionsMap() {
        if (!this.composition.config)
            throw new Error('O objeto de configuração não pode ser nulo.');
        
        this.optionsMap = new Map();
        for(let i = 0; i < this.composition.config.stepsConfig.length; i++){
            let optionMap: Map<number, MusicalCompositionOption[]> = new Map();
            for(let j = 0; j < this.composition.config.stepsConfig[i].groupsConfig.length; j++) {
                let options: MusicalCompositionOption[] = this.generateOptionsToChoice(i, j);
                optionMap.set(j, options);
            }
            this.optionsMap.set(i, optionMap);
        }
    }
    
    private generateOptionsToChoice(stepIndex: number, lineIndex: number): MusicalCompositionOption[] {
        let options: MusicalCompositionOption[] = []
        
        let optionConfig: MusicalCompositionOptionConfig;
        let optionSource: MusicalCompositionOptionSource;

        for (let i = 0; i < this.composition.source.stepsSource[stepIndex].groupsSource[lineIndex].optionsSource.length; i++) {
            optionConfig = this.composition.config.stepsConfig[stepIndex].groupsConfig[lineIndex].optionsConfig[i];
            optionSource = this.composition.source.stepsSource[stepIndex].groupsSource[lineIndex].optionsSource[i];
            let newOption: MusicalCompositionOption = new MusicalCompositionOption();
            newOption.fileName = optionConfig.fileName;
            newOption.musicalInstrument = optionConfig.defaultMusicalInstrument;
            newOption.musicalInstrumentsAllowed = optionConfig.musicalInstrumentsAllowed;
            newOption.midi = optionSource.midi; 
            newOption.spectrum = this.midiControl.generateMidiSpectrum(optionSource.midi);
            options.push(newOption);
        }
        
        return options; 
    }

    public compositionHasStarted(): boolean {
        return this.stepIndex > 0 || this.lineIndex > 0;
    }

    public compositionHasEnded(): boolean {
        return this.stepIndex > this.composition.source.stepsSource.length -1
    }

    public getOptionsToChoice(): MusicalCompositionOption[] {
        if (this.optionsMap.has(this.stepIndex) && this.optionsMap.get(this.stepIndex).has(this.lineIndex)) {
            return this.optionsMap.get(this.stepIndex).get(this.lineIndex)
        }
        return [];
    }


    public applyOptionChanges(option: MusicalCompositionOption) {
        option.applyMidiChanges();
        this.applyMidiChanges(option.midi);
    }
    
    public applyLineChanges(line: MusicalCompositionLine) {
        line.applyMidiChanges();
        this.applyMidiChanges(line.midi);
    }

    public applyGeneralChanges() {
        this.composition.midi = new Midi()
        let midiLines: Midi[] = [];
        for (let line of this.composition.lines) {
            line.applyMidiChanges();
            if (line.midi) {
                this.applyMidiChanges(line.midi);
                midiLines.push(line.midi);
            }
        }
        this.composition.midi = this.composition.midi.generateMidiType1(midiLines);
    }

    private applyMidiChanges(midi: Midi){
        midi.applyNoteTranspose(this.composition.keySignature);
        midi.applyTempoChange(this.composition.getTempo());
    }





    public applyChoice(option: MusicalCompositionOption){
        this.composition.lines[this.lineIndex].options.push(option);
        this.composition.lines[this.lineIndex].applyMidiChanges();

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

    

}
