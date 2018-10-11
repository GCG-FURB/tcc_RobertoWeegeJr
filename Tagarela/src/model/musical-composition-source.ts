import { Midi } from "../util/midi";

export class MusicalCompositionSource {
    private _relativePath: string;           //Caminho relativo raiz da composição 

    //Step  Source
    private _stepsSource: MusicalCompositionStepSource[];             //sdfsdfsdfsdf

    constructor(){
        this.stepsSource = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }

    get stepsSource(): MusicalCompositionStepSource[] {
        return this._stepsSource;
    }
    
    set stepsSource(stepsSource:MusicalCompositionStepSource[]) {
        if (!stepsSource) {
            throw new Error("As fonte de passos não podem ser nulas");
        }
        this._stepsSource = stepsSource;
    }
    
}

export class MusicalCompositionStepSource {

    //Step  Source
    private _relativePath: string;       //Caminho relativo raiz da composição 
    
    //Group  Source
    private _groupsSource: MusicalCompositionGroupSource[];           // 

    constructor(){
        this.groupsSource = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }
    
    get groupsSource(): MusicalCompositionGroupSource[] {
        return this._groupsSource;
    }
    
    set groupsSource(groupsSource:MusicalCompositionGroupSource[]) {
        if (!groupsSource) {
            throw new Error("As fontes de grupos não podem ser nulas");
        }
        this._groupsSource = groupsSource;
    }
}

export class MusicalCompositionGroupSource {

    //Group  Source
    private _relativePath: string;
    
    //Options  Source
    private _optionsSource: MusicalCompositionOptionSource[];
    
    constructor(){
        this.optionsSource = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }
    
    get optionsSource(): MusicalCompositionOptionSource[] {
        return this._optionsSource;
    }
    
    set optionsSource(optionsSource:MusicalCompositionOptionSource[]) {
        if (!optionsSource) {
            throw new Error("As fontes de opções não podem ser nulas");
        }
        this._optionsSource = optionsSource;
    }

}

export class MusicalCompositionOptionSource {

    //Options Source
    private _fileName: string;
    private _midi: Midi;

    get fileName(): string {
        return this._fileName;
    }
    
    set fileName(fileName:string) {
        if (!fileName || fileName.length <= 0){
            throw new Error("O nome do arquivo não pode ser nulo ou vazio");
        }
        this._fileName = fileName;
    }

    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi:Midi) {
        if (!midi) {
            throw new Error("O midi não pode ser nulo");
        }
        this._midi = midi;
    }

}
