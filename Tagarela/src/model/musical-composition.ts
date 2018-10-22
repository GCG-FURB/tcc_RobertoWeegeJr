import { Midi } from "./midi";
import { v4 as uuid } from 'uuid';
import { MusicalCompositionConfig } from "./musical-composition-config";
import { MusicalCompositionSource } from "./musical-composition-source";
import { MidiSpectrum } from "./midi-spectrum";
import { MidiControl } from "../control/midi";

export class MusicalComposition {
   
    private _minTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _maxTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _stepTempo: number;              //Passo a passo utilizado na composição
    private _tempo: number;                  //Tempo padrão aplicado no inicio da composição

    private _keySignature: number

    //midi
    private _midiId: string;
    private _midi: Midi;

    private _lines: MusicalCompositionLine[];

    public midiControl: MidiControl = new MidiControl();

    constructor() {
        this.lines = [];
        this.midiId = uuid();
    }

    get minTempo(): number {
        return this._minTempo;
    }
    
    set minTempo(minTempo:number) {
        minTempo = +minTempo
        if (!minTempo || minTempo < 1) {
            throw new Error("O tempo mínimo não pode ser nulo ou menor que 1");
        }
        if (this.maxTempo && minTempo > this.maxTempo) {
            throw new Error("O tempo mínimo não pode ser maior que o tempo máximo");
        }
        if (this.tempo && minTempo > this.tempo) {
            throw new Error("O tempo mínimo não pode ser maior que o tempo padrão");
        }
        this._minTempo = minTempo;
    }
    
    get maxTempo(): number {
        return this._maxTempo;
    }
    
    set maxTempo(maxTempo:number) {
        maxTempo = +maxTempo;
        if (!maxTempo || maxTempo < 1) {
            throw new Error("O tempo máximo não pode ser nulo ou menor que 1");
        }
        if (this.minTempo && maxTempo < this.minTempo) {
            throw new Error("O tempo máximo não pode ser menor que o tempo mínimo");
        }
        if (this.tempo && maxTempo < this.tempo) {
            throw new Error("O tempo máximo não pode ser menor que o tempo padrão");
        }
        this._maxTempo = maxTempo;
    }
    
    get stepTempo(): number {
        return this._stepTempo;
    }
    
    set stepTempo(stepTempo:number) {
        stepTempo = +stepTempo
        if (!stepTempo || stepTempo < 1) {
            throw new Error("O intervalo de escolha de tempo não pode ser nulo ou menor que 1");
        }
        this._stepTempo = stepTempo;
    }
    
    get tempo(): number {
        return this._tempo;
    }
    
    set tempo(tempo: number) {
        if (!tempo || tempo < 1) {
            throw new Error("O tempo padrão não pode ser nulo ou menor que 1");
        }
        if (this.minTempo && tempo < this.minTempo) {
            throw new Error("O tempo padrão não pode ser menor que o tempo mínimo");
        }
        if (this.maxTempo && tempo > this.maxTempo) {
            throw new Error("O tempo padrão não pode ser maior que o tempo máximo");
        }
        this._tempo = tempo;
    }
    
    get keySignature(): number {
        return this._keySignature;
    }
    
    set keySignature(keySignature:number) {
        this._keySignature = keySignature;
    }


    
    get midiId(): string {
        return this._midiId;
    }
    
    set midiId(midiId:string) {
        this._midiId = midiId;
    }
    
    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi:Midi) {
        this._midi = midi;
    }

    get lines(): MusicalCompositionLine[] {
        return this._lines;
    }
    
    set lines(lines:MusicalCompositionLine[]) {
        if (!lines) {
            throw new Error("As urações de linhas não podem ser nulas");
        }
        this._lines = lines;
    }


    public getTempo(): number {
        return  Math.round(60000000 / this.tempo)
    }

}

export class MusicalCompositionLine {

    private _name: string;
    private _minVolume: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _maxVolume: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _stepVolume: number;              //Passo a passo utilizado na composição
    private _volume: number;                  //Tempo padrão aplicado no inicio da composição

    //midi
    private _midiId: string;
    private _midi: Midi;

    public options: MusicalCompositionOption[];

    constructor(){
        this.options = []
        this.midiId = uuid();
    }

    get name(): string {
        return this._name;
    }
    
    set name(name:string) {
        if (!name || name.length <= 0){
            throw new Error("O nome não pode ser nulo ou vazio");
        }
        this._name = name;
    }
    
    get minVolume(): number {
        return this._minVolume;
    }
    
    set minVolume(minVolume:number) {
        minVolume = +minVolume
        if ((!minVolume && minVolume !== 0) || minVolume < 0) {
            throw new Error("O volume mínimo não pode ser nulo ou menor que 0");
        }
        if (this.maxVolume && minVolume > this.maxVolume) {
            throw new Error("O volume mínimo não pode ser maior que o volume máximo");
        }
        if (this.volume && minVolume > this.volume) {
            throw new Error("O volume mínimo não pode ser maior que o volume padrão");
        }
        this._minVolume = minVolume;
    }
    
    get maxVolume(): number {
        return this._maxVolume;
    }
    
    set maxVolume(maxVolume:number) {
        maxVolume = +maxVolume
        if ((!maxVolume && maxVolume !== 0) || maxVolume < 0) {
            throw new Error("O volume máximo não pode ser nulo ou menor que 0");
        }
        if (this.minVolume && maxVolume < this.minVolume) {
            throw new Error("O volume máximo não pode ser menor que o volume mínimo");
        }
        if (this.volume && maxVolume < this.volume) {
            throw new Error("O volume máximo não pode ser menor que o volume padrão");
        }
        this._maxVolume = maxVolume;
    }
    
    get stepVolume(): number {
        return this._stepVolume;
    }
    
    set stepVolume(stepVolume:number) {
        stepVolume = +stepVolume
        if (!stepVolume || stepVolume < 1) {
            throw new Error("O intervalo de escolha de volume não pode ser nulo ou menor que 1");
        }
        this._stepVolume = stepVolume;
    }
    
    get volume(): number {
        return this._volume;
    }
    
    set volume(volume:number) {
        volume = +volume
        if ((!volume && volume !== 0) || volume < 0) {
            throw new Error("O volume padrão não pode ser nulo ou menor que 0");
        }
        if (this.minVolume && volume < this.minVolume) {
            throw new Error("O volume padrão não pode ser menor que o volume mínimo");
        }
        if (this.maxVolume && volume > this.maxVolume) {
            throw new Error("O volume padrão não pode ser maior que o volume máximo");
        }
        this._volume = volume;
    }

    get midiId(): string {
        return this._midiId;
    }
    
    set midiId(midiId:string) {
        this._midiId = midiId;
    }
    
    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi:Midi) {
        this._midi = midi;
    }

    applyMidiChanges() {
        if (this.options.length > 0) {
            this.options[0].applyMidiChanges();
            this.midi = this.options[0].midi.cloneMidi();
        } else {
            this.midi = null;
        }
        for (let i = 1; i < this.options.length; i++) {
            this.options[i].applyMidiChanges();
            this.midi.concatenateMidi(this.options[i].midi);
        }        
        if (this.midi) {
            this.midi.applyVolumeChange(this.volume);
        }
    }

    public getMinSpectrumNote(){

        if (this.options.length <= 0)
            return null;

        let minValue: number = this.options[0].spectrum.minNote;

        for (let option of this.options) {
            if (option.spectrum && option.spectrum.minNote < minValue)
                minValue = option.spectrum.minNote
        }

        return minValue;
    }

    public getMaxSpectrumNote(){

        if (this.options.length <= 0)
            return null;

        let maxValue: number = this.options[0].spectrum.maxNote;

        for (let option of this.options) {
            if (option.spectrum && option.spectrum.maxNote > maxValue)
                maxValue = option.spectrum.maxNote
        }

        return maxValue;
    }


}

export class MusicalCompositionOption {

    //Options 
    private _fileName: string;
    private _musicalInstrumentsAllowed: number[]
    private _musicalInstrument: number;

    private _midiId: string;
    private _midi: Midi;
    public spectrum: MidiSpectrum;

    constructor() {
        this.midiId = uuid();
    }

    get fileName(): string {
        return this._fileName;
    }
    
    set fileName(fileName:string) {
        if (!fileName || fileName.length <= 0){
            throw new Error("O nome do arquivo não pode ser nulo ou vazio");
        }
        this._fileName = fileName;
    }
    
    get musicalInstrumentsAllowed(): number[] {
        return this._musicalInstrumentsAllowed;
    }
    
    set musicalInstrumentsAllowed(musicalInstrumentsAllowed:number[]) {
        if (!musicalInstrumentsAllowed) {
            throw new Error("Os instrumentos musicais permitidos não podem ser nulos");
        }
        this._musicalInstrumentsAllowed = musicalInstrumentsAllowed;
    }
    
    get musicalInstrument(): number {
        return this._musicalInstrument;
    }
    
    set musicalInstrument(musicalInstrument:number) {
        musicalInstrument = +musicalInstrument
        if (!musicalInstrument && musicalInstrument !== 0) {
            throw new Error("O instrumento musical padrão não pode ser nulo");
        }
        this._musicalInstrument = musicalInstrument;
    }

    get midiId(): string {
        return this._midiId;
    }
    
    set midiId(midiId:string) {
        this._midiId = midiId;
    }
    
    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi:Midi) {
        this._midi = midi;
    }

    public applyMidiChanges() {
        this.midi.applyInstrumentChange(this.musicalInstrument);
    }

}