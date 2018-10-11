import { File } from '@ionic-native/file';
import { FileUtil } from "./file";
import { Midi, MidiConstants } from './midi';
import { v4 as uuid } from 'uuid';
import { MidiMusicalInstrument } from './midi-models';

export class MusicalCompositionSource {

    private fileUtil: FileUtil;
    private _rootStep: MusicalCompositionStep;
    public musicalCompositionSourceOptions: MusicalCompositionSourceOptions;

    get rootStep(): MusicalCompositionStep {
        return this._rootStep;
    }

    set rootStep(rootStep: MusicalCompositionStep) {
        this._rootStep = rootStep;
    }

    constructor(file: File){
        this.fileUtil = new FileUtil(file);
        this.musicalCompositionSourceOptions = new MusicalCompositionSourceOptions();
    }

    public async buildSource(devicePath: string, relativePath: string) {
        try {
            this.rootStep = null;
            let stepDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(devicePath, relativePath);
            let lastCompositionStep: MusicalCompositionStep;
            //steps
            for (let stepDirectory of stepDirectoriesList) {
                let musicalCompositionStep = new MusicalCompositionStep();
                musicalCompositionStep.name = stepDirectory;     
                let stepPath: string = this.fileUtil.concatenatePath(relativePath, stepDirectory);
                let lineDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(devicePath, stepPath);
                //lines
                for (let lineDirectory of lineDirectoriesList) {
                    let musicalCompositionLine = new MusicalCompositionLine();
                    musicalCompositionLine.name = lineDirectory;
                    let linePath: string = this.fileUtil.concatenatePath(stepPath, lineDirectory);
                    let optionDirectoriesList: string[] = await this.fileUtil.getListOfFiles(devicePath, linePath)
                    //options
                    for (let optionFile of optionDirectoriesList) {
                        let musicalCompositionOption = new MusicalCompositionOption();
                        musicalCompositionOption.name = optionFile;
                        let fullOptionPath: string = this.fileUtil.concatenatePath(devicePath, linePath);
                        musicalCompositionOption.midiFile = await this.fileUtil.readFileAsBinaryString(fullOptionPath, optionFile);
                        musicalCompositionOption.setupMidi();
                        musicalCompositionLine.addCompositionOption(musicalCompositionOption);
                    }
                    musicalCompositionStep.addCompositionLine(musicalCompositionLine);
                }
                if (this.rootStep) {
                    lastCompositionStep.nextStep = musicalCompositionStep;
                } else {
                    this.rootStep = musicalCompositionStep;
                }
                lastCompositionStep = musicalCompositionStep;
            }

        } catch (e) {
            console.log(e)
        }
    }

    public async buildSourceOptions(devicePath: string, relativePath: string) {
        try {
            let stepDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(devicePath, relativePath);
            //steps
            for (let stepDirectory of stepDirectoriesList) {
                let stepPath: string = this.fileUtil.concatenatePath(relativePath, stepDirectory);
                let lineDirectoriesList: string[] = await this.fileUtil.getListOfDirectories(devicePath, stepPath);
                //lines
                for (let lineDirectory of lineDirectoriesList) {
                    this.musicalCompositionSourceOptions.addLineOptions(new MusicalCompositionLineOptions(lineDirectory), true)
                    let linePath: string = this.fileUtil.concatenatePath(stepPath, lineDirectory);
                    let optionDirectoriesList: string[] = await this.fileUtil.getListOfFiles(devicePath, linePath)
                    //options
                    for (let optionFile of optionDirectoriesList) {
                        this.musicalCompositionSourceOptions.addOptionOptions(new MusicalCompositionOptionOptions(optionFile), true)

                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}

export class MusicalCompositionSourceOptions {
    
    public minTempoValue: number = 40;
    public maxTempoValue: number = 220;
    public stepTempoValue: number = 1;
    public startTempoValue: number = 120;

    public musicalCompositionLineOptions: MusicalCompositionLineOptions[];
    public musicalCompositionOptionOptions: MusicalCompositionOptionOptions[];

    constructor() {
        this.musicalCompositionLineOptions = [];
        this.musicalCompositionOptionOptions = [];
    }

    public addLineOptions(lineOptions: MusicalCompositionLineOptions, distintValue?: boolean) {
        if (distintValue) {
            if (this.musicalCompositionLineOptions.find((element) => {
                return element.name == lineOptions.name
            })) {
                return;
            }
        }
        this.musicalCompositionLineOptions.push(lineOptions);
    }

    public addOptionOptions(optionOptions: MusicalCompositionOptionOptions, distintValue?: boolean) {
        if (distintValue) {
            if (this.musicalCompositionOptionOptions.find((element) => {
                return element.name == optionOptions.name
            })) {
                return;
            }
        }
        this.musicalCompositionOptionOptions.push(optionOptions);
    }

}

export class MusicalCompositionLineOptions {
    public name: string;
    public minVolumeValue: number = 0;
    public maxVolumeValue: number = 200;
    public stepVolumeValue: number = 10;
    public startVolumeValue: number = 100;

    constructor(name: string) {
        this.name = name;
    }

}

export class MusicalCompositionOptionOptions {
    public name: string;
    public musicalInstrumentsValues: number[] = [0, 56];

    constructor(name: string) {
        this.name = name;
    }
}

export class MusicalCompositionStep {
    
    private _name: string
    private _musicalCompositionLine: MusicalCompositionLine[];
    private _nextStep: MusicalCompositionStep;

    constructor() {
        this._musicalCompositionLine = [];
    }
    
    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }
    
    get musicalCompositionLine(): MusicalCompositionLine[] {
        return this._musicalCompositionLine;
    }

    set musicalCompositionLine(musicalCompositionLine: MusicalCompositionLine[]) {
        this._musicalCompositionLine = musicalCompositionLine;
    }

    get nextStep(): MusicalCompositionStep {
        return this._nextStep;
    }

    set nextStep(nextStep: MusicalCompositionStep) {
        this._nextStep = nextStep;
    }

    public addCompositionLine(musicalCompositionLine: MusicalCompositionLine){
        this.musicalCompositionLine.push(musicalCompositionLine);
    }

}

export class MusicalCompositionLine {
    
    private _name: string
    private _musicalCompositionOption: MusicalCompositionOption[];

    constructor() {
        this.musicalCompositionOption = [];
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get musicalCompositionOption(): MusicalCompositionOption[] {
        return this._musicalCompositionOption;
    }

    set musicalCompositionOption(musicalCompositionOption: MusicalCompositionOption[]) {
        this._musicalCompositionOption = musicalCompositionOption;
    }

    public addCompositionOption(musicalCompositionOption: MusicalCompositionOption){
        this.musicalCompositionOption.push(musicalCompositionOption);
    }

}

export class MusicalCompositionOption {

    private _uId: string;
    private _name: string;
    private _midiFile: string;
    private _midi: Midi;
    public midiCompositionOptions: MidiCompositionOptions;

    constructor() {
        this.uId = uuid();
        this.midiCompositionOptions = new MidiCompositionOptions();
    }

    get uId(): string {
        return this._uId;
    }

    set uId(uId: string) {
        this._uId = uId;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get midiFile(): string {
        return this._midiFile;
    }

    set midiFile(midiFile: string) {
        this._midiFile = midiFile;
    }

    get midi(): Midi {
        return this._midi;
    }

    set midi(midi: Midi) {
        this._midi = midi;
    }

    setupMidi(){
        this.midi = new Midi();
        this.midi.setupMidiFromFile(this.midiFile);
    }

}

export class Composition {

    private _musicalCompositionSource: MusicalCompositionSource;
    private _compositionLines: CompositionLine[];
    private _actualStep: MusicalCompositionStep;
    private _compositionLineIndex: number;
    public midiId: string;
    public midi: Midi;
    public compositionOptions: CompositionOptions;

    constructor(musicalCompositionSource: MusicalCompositionSource) {
        this._musicalCompositionSource = musicalCompositionSource;
        this.compositionLines = [];
        this.actualStep = musicalCompositionSource.rootStep;
        this.compositionLineIndex = 0;
        this.midiId = uuid();
        this.compositionOptions = new CompositionOptions();

        this.compositionOptions.minTempoValue = musicalCompositionSource.musicalCompositionSourceOptions.minTempoValue;
        this.compositionOptions.maxTempoValue = musicalCompositionSource.musicalCompositionSourceOptions.maxTempoValue;
        this.compositionOptions.stepTempoValue = musicalCompositionSource.musicalCompositionSourceOptions.stepTempoValue;
        this.compositionOptions.tempo = musicalCompositionSource.musicalCompositionSourceOptions.startTempoValue;
    }

    public applyChoice(choice: MusicalCompositionOption) {
        if (this.compositionLines.length <= this.compositionLineIndex) {
            this.addCompositionLine(this.actualStep.musicalCompositionLine[this.compositionLineIndex].name);
        }
        this.compositionLines[this.compositionLineIndex].addCompositionOption(choice);
        this.compositionLineIndex++;
        if (this.actualStep.musicalCompositionLine.length <= this.compositionLineIndex) {
            this.compositionLineIndex = 0;
            this.actualStep = this.actualStep.nextStep;
        } 
    }

    get compositionLines(): CompositionLine[] {
        return this._compositionLines;
    }

    set compositionLines(compositionLines: CompositionLine[]) {
        this._compositionLines = compositionLines;
    }

    public addCompositionLine(name: string){
        this.compositionLines.push(new CompositionLine(name));
    }

    public addCompositionOption(compositionIndex: number, musicalCompositionOption: MusicalCompositionOption){
        this.compositionLines[compositionIndex].addCompositionOption(musicalCompositionOption);
    }

    get actualStep(): MusicalCompositionStep {
        return this._actualStep;
    }

    set actualStep(actualStep: MusicalCompositionStep) {
        this._actualStep = actualStep;
    }

    get compositionLineIndex(): number {
        return this._compositionLineIndex;
    }

    set compositionLineIndex(compositionLineIndex: number) {
        this._compositionLineIndex = compositionLineIndex;
    }

    public generateGeneralMidi() {
        this.midi = new Midi();
        let midiLines: Midi[] = [];
        for (let compositionLine of this.compositionLines) {
            compositionLine.generateLineMidi();
            midiLines.push(compositionLine.lineMidi);
        }
        this.midi.generateMidiType1(midiLines);
    }


    public getSignatureKey(): number {
        return this.compositionOptions.getkeySignatureValue();
    }

    public getTempo(): number {
        return this.compositionOptions.getTempoValue();
    }

 }

export class CompositionOptions {

    public TONE_VALUES: string[] = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];
    
    public minTempoValue: number = 40;
    public maxTempoValue: number = 200;
    public stepTempoValue: number = 1;
    public tempo: number;

    public keySignatureIndex: number;

    constructor () {
        this.keySignatureIndex = 0;
        this.tempo = 120;
    }

    public getTempoValue(): number {
        //Tempo in microseconds per quarter note
        return  Math.round(60000000 / this.tempo)
    }

    public getkeySignatureValue(): number{
        return MidiConstants.KEY_SIGNATURE_CONVERSION_VECTOR[this.keySignatureIndex];
    }

}

export class CompositionMidiOptions {
    public musicalInstrument: MidiMusicalInstrument;

    constructor(midiInstrumentNumber: number) {
        this.musicalInstrument = new MidiMusicalInstrument(midiInstrumentNumber);
    }

}

export class MidiCompositionOptions {
    public musicalInstrumentNumber: number = 0;
}

export class LineCompositionOptions {
    public volume: number = 100;

}



export class CompositionLine {
    
    public name: string;
    private _compositionOptions: MusicalCompositionOption[];
    public lineMidiId: string;
    public lineMidi: Midi;
    public lineCompositionOptions: LineCompositionOptions;
    

    constructor(name: string) {
        this.name = name;
        this.compositionOptions = [];
        this.lineMidiId = uuid();
        this.lineCompositionOptions = new LineCompositionOptions();
    }

    get compositionOptions(): MusicalCompositionOption[] {
        return this._compositionOptions;
    }

    set compositionOptions(compositionOptions: MusicalCompositionOption[]) {
        this._compositionOptions = compositionOptions;
    }

    public generateLineMidi() {
        if (this.compositionOptions.length > 0) {
            this.compositionOptions[0].midi.applyInstrumentChange(this.compositionOptions[0].midiCompositionOptions.musicalInstrumentNumber);
            this.lineMidi = this.compositionOptions[0].midi.cloneMidi();
        }
        for (let i = 1; i < this.compositionOptions.length; i++) {
            this.compositionOptions[i].midi.applyInstrumentChange(this.compositionOptions[i].midiCompositionOptions.musicalInstrumentNumber);
            this.lineMidi.concatenateMidi(this.compositionOptions[i].midi);
        }        
        this.lineMidi.applyVolumeChange(this.lineCompositionOptions.volume);
    }

    public addCompositionOption(musicalCompositionOption: MusicalCompositionOption){
        this.compositionOptions.push(musicalCompositionOption);
    }

}