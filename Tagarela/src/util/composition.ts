import { File } from '@ionic-native/file';
import { FileUtil } from "./file";
import { Midi } from './midi';
import { v4 as uuid } from 'uuid';

export class MusicalCompositionSource {

    private fileUtil: FileUtil;
    private _rootStep: MusicalCompositionStep;

    get rootStep(): MusicalCompositionStep {
        return this._rootStep;
    }

    set rootStep(rootStep: MusicalCompositionStep) {
        this._rootStep = rootStep;
    }

    constructor(file: File){
        this.fileUtil = new FileUtil(file);
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

            /*
            let teste:MusicalCompositionStep = this.rootStep;
            while (teste){
                alert(teste.name)
                for (let a of teste._musicalCompositionLine){
                    alert(a.name)
                    for (let b of a._musicalCompositionOption){
                        alert(b.name)
                    }
                }
                teste = teste.nextStep
            }
            */

        } catch (e) {
            console.log(e)
        }
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

    constructor() {
        this.uId = uuid();
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
        this.midi.setupMidiFromFile(this.midiFile)
    }

}

export class Composition {

    private _compositionLines: CompositionLine[];

    constructor() {
        this.compositionLines = [];
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

}

export class CompositionLine {
    
    public name: string;
    private _compositionOptions: MusicalCompositionOption[];

    constructor(name: string) {
        this.name = name;
        this.compositionOptions = [];
    }

    get compositionOptions(): MusicalCompositionOption[] {
        return this._compositionOptions;
    }

    set compositionOptions(compositionOptions: MusicalCompositionOption[]) {
        this._compositionOptions = compositionOptions;
    }

    public addCompositionOption(musicalCompositionOption: MusicalCompositionOption){
        this.compositionOptions.push(musicalCompositionOption);
    }


}