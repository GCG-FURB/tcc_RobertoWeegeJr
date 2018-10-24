import { Midi } from "./midi";
import { v4 as uuid } from "uuid";
import { MidiSpectrum } from "./midi-spectrum";

export class MusicalComposition {

    private CONVERSION_FACTOR_TEMPO: number = 60000000;
   
    private _minTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _maxTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _stepTempo: number;              //Passo a passo utilizado na composição
    private _tempo: number;                  //Tempo padrão aplicado no inicio da composição

    private _keySignature: number

    keySignaturesAllowed;
    showCompositionData;

    //midi
    private _midiId: string;
    private _midi: Midi;

    private _lines: MusicalCompositionLine[];

    public numerator: number
    public denominator: number
    public mode: number

    timeDivisionMetric: number;

    constructor() {
        this.lines = [];
        this.midiId = uuid();
    }

    get minTempo(): number {
        return this._minTempo;
    }
    
    set minTempo(minTempo:number) {
        minTempo = +minTempo
        if (!minTempo && minTempo != 0) 
            throw new Error(`O tempo mínimo não pode ser nulo.`);

        if (Math.round(this.CONVERSION_FACTOR_TEMPO / minTempo) < Midi.MIN_TEMPO_NUMBER) 
            throw new Error(`O fator de conversão (${this.CONVERSION_FACTOR_TEMPO}) dividido tempo mínimo não pode menor que ${Midi.MIN_TEMPO_NUMBER}.`);
        
        if (Math.round(this.CONVERSION_FACTOR_TEMPO / minTempo) > Midi.MAX_TEMPO_NUMBER)
            throw new Error(`O fator de conversão (${this.CONVERSION_FACTOR_TEMPO}) dividido tempo mínimo não pode maior que ${Midi.MAX_TEMPO_NUMBER}.`);
        
        if ((this.maxTempo || this.maxTempo == 0) && minTempo > this.maxTempo) 
            throw new Error(`O tempo mínimo não pode ser maior que o tempo máximo.`);
        
        if ((this.tempo || this.tempo == 0) && minTempo > this.tempo) 
            throw new Error(`O tempo mínimo não pode ser maior que o tempo`);
        
        if ((this.stepTempo || this.stepTempo == 0) && (this.maxTempo || this.maxTempo == 0) && this.stepTempo > this.maxTempo - minTempo)
            throw new Error(`O intervalo de escolha de tempo não pode ser maior que a diferença entre o tempo máximo e o mínimo.`);
        
        this._minTempo = minTempo;
    }
    
    get maxTempo(): number {
        return this._maxTempo;
    }
    
    set maxTempo(maxTempo:number) {
        maxTempo = +maxTempo;
        if (!maxTempo && maxTempo != 0) 
            throw new Error(`O tempo máximo não pode ser nulo.`);
        
        if (Math.round(this.CONVERSION_FACTOR_TEMPO / maxTempo) < Midi.MIN_TEMPO_NUMBER) 
            throw new Error(`O fator de conversão (${this.CONVERSION_FACTOR_TEMPO}) dividido tempo máximo não pode menor que ${Midi.MIN_TEMPO_NUMBER}.`);
        
        if (Math.round(this.CONVERSION_FACTOR_TEMPO / maxTempo) > Midi.MAX_TEMPO_NUMBER) 
            throw new Error(`O fator de conversão (${this.CONVERSION_FACTOR_TEMPO}) dividido tempo máximo não pode maior que ${Midi.MAX_TEMPO_NUMBER}.`);
        
        if ((this.minTempo || this.minTempo == 0) && maxTempo < this.minTempo) 
            throw new Error(`O tempo máximo não pode ser menor que o tempo máximo.`);
        
        if ((this.tempo || this.tempo == 0) && maxTempo < this.tempo) 
            throw new Error(`O tempo máximo não pode ser menor que o tempo.`);
        
        if ((this.stepTempo || this.stepTempo == 0) && (this.minTempo || this.minTempo == 0)  && this.stepTempo > maxTempo - this.minTempo) 
            throw new Error(`O intervalo de escolha de tempo não pode ser maior que a diferença entre o tempo máximo e o mínimo.`);
        
        this._maxTempo = maxTempo;
    }
    
    get stepTempo(): number {
        return this._stepTempo;
    }
    
    set stepTempo(stepTempo:number) {
        stepTempo = +stepTempo
        if (!stepTempo && stepTempo != 0)
            throw new Error(`O intervalo de escolha de tempo não pode ser nulo.`);
        
        if ((this.maxTempo || this.maxTempo == 0) && (this.minTempo || this.minTempo == 0) && stepTempo > this.maxTempo - this.minTempo)
            throw new Error(`O intervalo de escolha de tempo não pode ser maior que a diferença entre o tempo máximo e o mínimo.`);
        
        this._stepTempo = stepTempo;
    }
    
    get tempo(): number {
        return this._tempo;
    }
    
    set tempo(tempo: number) {
        if (!tempo && tempo != 0) 
            throw new Error(`O tempo não pode ser nulo.`);
        
        if (Math.round(this.CONVERSION_FACTOR_TEMPO / tempo) < Midi.MIN_TEMPO_NUMBER) 
            throw new Error(`O fator de conversão (${this.CONVERSION_FACTOR_TEMPO}) dividido tempo não pode menor que ${Midi.MIN_TEMPO_NUMBER}.`);
        
        if (Math.round(this.CONVERSION_FACTOR_TEMPO / tempo) > Midi.MAX_TEMPO_NUMBER) 
            throw new Error(`O fator de conversão (${this.CONVERSION_FACTOR_TEMPO}) dividido tempo não pode maior que ${Midi.MAX_TEMPO_NUMBER}.`);
        
        if ((this.minTempo || this.minTempo == 0) && tempo < this.minTempo) 
            throw new Error(`O tempo padrão não pode ser menor que o tempo mínimo.`);
        
        if ((this.maxTempo || this.maxTempo == 0) && tempo > this.maxTempo) 
            throw new Error(`O tempo padrão não pode ser maior que o tempo máximo.`);
        
        this._tempo = tempo;
    }
    
    get keySignature(): number {
        return this._keySignature;
    }
    
    set keySignature(keySignature: number) {
        keySignature=+keySignature

        if (!keySignature && keySignature != 0)
            throw new Error(`A armadura de clave não pode ser nula.`);
        
        if (Midi.KEY_SIGNATURES_ARRAY.indexOf(keySignature) < 0) 
            throw new Error(`A armadura de clave deve se um valor entre ${JSON.stringify(Midi.KEY_SIGNATURES_ARRAY)}.`);

        this._keySignature = keySignature;
        
    }

    get midiId(): string {
        return this._midiId;
    }
    
    set midiId(midiId: string) {
        if (!midiId || midiId.length <= 0)
            throw new Error(`O identificador de midi não pode ser nulo ou vazio.`);
        
        this._midiId = midiId;
    }
    
    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi: Midi) {
        if (!midi)
            throw new Error(`O midi não pode ser nulo.`);
        this._midi = midi;
    }

    get lines(): MusicalCompositionLine[] {
        return this._lines;
    }
    
    set lines(lines:MusicalCompositionLine[]) {
        if (!lines) {
            throw new Error(`As linhas não podem ser nulas`);
        }
        this._lines = lines;
    }

    public getTempo(): number {
        return  Math.round(this.CONVERSION_FACTOR_TEMPO / this.tempo)
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
        if (!name || name.length <= 0)
            throw new Error(`O nome não pode ser nulo ou vazio.`);
        
        this._name = name;
    }
    
    get minVolume(): number {
        return this._minVolume;
    }
    
    set minVolume(minVolume:number) {
        minVolume = +minVolume
        if (!minVolume && minVolume != 0) 
            throw new Error(`O volume mínimo não pode ser nulo.`);

        if (minVolume < Midi.LOWER_ALLOWED_VOLUME) 
            throw new Error(`O volume mínimo não pode menor que ${Midi.LOWER_ALLOWED_VOLUME}.`);
        
        if (minVolume > Midi.HIGHEST_ALLOWED_VOLUME)
            throw new Error(`O volume mínimo não pode maior que ${Midi.HIGHEST_ALLOWED_VOLUME}.`);
        
        if ((this.maxVolume || this.maxVolume == 0) && minVolume > this.maxVolume) 
            throw new Error(`O volume mínimo não pode ser maior que o volume máximo.`);
        
        if ((this.volume || this.volume == 0) && minVolume > this.volume) 
            throw new Error(`O volume mínimo não pode ser maior que o volume`);
        
        if ((this.stepVolume || this.stepVolume == 0) && (this.maxVolume || this.maxVolume == 0) && this.stepVolume > this.maxVolume - minVolume)
            throw new Error(`O intervalo de escolha de volume não pode ser maior que a diferença entre o volume máximo e o mínimo.`);

        this._minVolume = minVolume;
    }

    get maxVolume(): number {
        return this._maxVolume;
    }
    
    set maxVolume(maxVolume:number) {
        maxVolume = +maxVolume
        if (!maxVolume && maxVolume != 0) 
            throw new Error(`O volume máximo não pode ser nulo.`);

        if (maxVolume < Midi.LOWER_ALLOWED_VOLUME) 
            throw new Error(`O volume máximo não pode menor que ${Midi.LOWER_ALLOWED_VOLUME}.`);
        
        if (maxVolume > Midi.HIGHEST_ALLOWED_VOLUME)
            throw new Error(`O volume máximo não pode maior que ${Midi.HIGHEST_ALLOWED_VOLUME}.`);
        
        if ((this.minVolume || this.minVolume == 0) && maxVolume < this.minVolume) 
            throw new Error(`O volume máximo não pode ser menor que o volume mínimo.`);
        
        if ((this.volume || this.volume == 0) && maxVolume < this.volume) 
            throw new Error(`O volume máximo não pode ser menor que o volume`);
        
        if ((this.stepVolume || this.stepVolume == 0) && (this.minVolume || this.minVolume == 0) && this.stepVolume > maxVolume - this.minVolume)
            throw new Error(`O intervalo de escolha de volume não pode ser maior que a diferença entre o volume máximo e o mínimo.`);

        this._maxVolume = maxVolume;
    }
    
    get stepVolume(): number {
        return this._stepVolume;
    }
    
    set stepVolume(stepVolume:number) {
        stepVolume = +stepVolume
        if (!stepVolume && stepVolume != 0) 
            throw new Error(`O intervalo de escolha de volume não pode ser nulo.`);

        if ((this.maxVolume || this.maxVolume == 0) && (this.minVolume || this.minVolume == 0) && stepVolume > this.maxVolume - this.minVolume)
            throw new Error(`O intervalo de escolha de volume não pode ser maior que a diferença entre o volume máximo e o mínimo.`);

        this._stepVolume = stepVolume;
    }
    
    get volume(): number {
        return this._volume;
    }
    
    set volume(volume:number) {
        volume = +volume
        if (!volume && volume != 0) 
            throw new Error(`O volume não pode ser nulo.`);

        if (volume < Midi.LOWER_ALLOWED_VOLUME) 
            throw new Error(`O volume não pode menor que ${Midi.LOWER_ALLOWED_VOLUME}.`);
        
        if (volume > Midi.HIGHEST_ALLOWED_VOLUME)
            throw new Error(`O volume não pode maior que ${Midi.HIGHEST_ALLOWED_VOLUME}.`);

        if ((this.minVolume || this.minVolume == 0) && volume < this.minVolume) 
            throw new Error(`O volume padrão não pode ser menor que o volume mínimo.`);
        
        if ((this.maxVolume || this.maxVolume == 0) && volume > this.maxVolume) 
            throw new Error(`O volume padrão não pode ser maior que o volume máximo.`);
        
        this._volume = volume;
    }

    get midiId(): string {
        return this._midiId;
    }
    
    set midiId(midiId: string) {
        if (!midiId || midiId.length <= 0)
            throw new Error(`O identificador de midi não pode ser nulo ou vazio.`);
        
        this._midiId = midiId;
    }
    
    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi: Midi) {
        if (!midi)
            throw new Error(`O midi não pode ser nulo.`);
        this._midi = midi;
    }

    public applyMidiChanges() {
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

    public getMinSpectrumNote() {
        if (this.options.length <= 0)
            return null;
        let minValue: number = this.options[0].spectrum.minNote;
        for (let option of this.options) {
            if (option.spectrum && option.spectrum.minNote < minValue)
                minValue = option.spectrum.minNote
        }
        return minValue;
    }

    public getMaxSpectrumNote() {

        if (this.options.length <= 0)
            return null;

        let maxValue: number = this.options[0].spectrum.maxNote;

        for (let option of this.options) {
            if (option.spectrum && option.spectrum.maxNote > maxValue)
                maxValue = option.spectrum.maxNote
        }

        return maxValue;
    }

    public getTotalDeltaTime(): number {
        let totalDeltaTime: number = 0;
        for (let option of this.options) {
            totalDeltaTime += option.getDeltaTimeSum();
        }
        return totalDeltaTime;
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
            throw new Error(`O nome do arquivo não pode ser nulo ou vazio`);
        }
        this._fileName = fileName;
    }
    
    get musicalInstrumentsAllowed(): number[] {
        return this._musicalInstrumentsAllowed;
    }
    
    set musicalInstrumentsAllowed(musicalInstrumentsAllowed: number[]) {
        if (!musicalInstrumentsAllowed) 
            throw new Error(`Os instrumentos musicais permitidos não podem ser nulos.`);
        
        for (let musicalInstrument of musicalInstrumentsAllowed) {
            if (musicalInstrument < Midi.MIN_MUSICAL_INSTRUMENT_NUMBER && musicalInstrument != Midi.DRUM_INSTRUMENT_NUMBER) 
                throw new Error(`O instrumento musical não pode menor que ${Midi.MIN_MUSICAL_INSTRUMENT_NUMBER}.`);
            
            if (musicalInstrument > Midi.MAX_MUSICAL_INSTRUMENT_NUMBER && musicalInstrument != Midi.DRUM_INSTRUMENT_NUMBER)
                throw new Error(`O instrumento musical não pode maior que ${Midi.MAX_MUSICAL_INSTRUMENT_NUMBER}.`);
        }

        this._musicalInstrumentsAllowed = musicalInstrumentsAllowed;
    }
    
    get musicalInstrument(): number {
        return this._musicalInstrument;
    }
    
    set musicalInstrument(musicalInstrument:number) {
        musicalInstrument = +musicalInstrument
        if (!musicalInstrument && musicalInstrument !== 0) 
            throw new Error(`O instrumento musical padrão não pode ser nulo.`);

        if (musicalInstrument < Midi.MIN_MUSICAL_INSTRUMENT_NUMBER && musicalInstrument != Midi.DRUM_INSTRUMENT_NUMBER) 
            throw new Error(`O instrumento musical não pode menor que ${Midi.MIN_MUSICAL_INSTRUMENT_NUMBER}.`);
        
        if (musicalInstrument > Midi.MAX_MUSICAL_INSTRUMENT_NUMBER && musicalInstrument != Midi.DRUM_INSTRUMENT_NUMBER)
            throw new Error(`O instrumento musical não pode maior que ${Midi.MAX_MUSICAL_INSTRUMENT_NUMBER}.`);

        this._musicalInstrument = musicalInstrument;
    }

    get midiId(): string {
        return this._midiId;
    }
    
    set midiId(midiId: string) {
        if (!midiId || midiId.length <= 0)
            throw new Error(`O identificador de midi não pode ser nulo ou vazio.`);
        
        this._midiId = midiId;
    }
    
    get midi(): Midi {
        return this._midi;
    }
    
    set midi(midi: Midi) {
        if (!midi)
            throw new Error(`O midi não pode ser nulo.`);
        this._midi = midi;
    }

    public applyMidiChanges() {
        this.midi.applyInstrumentChange(this.musicalInstrument);
    }


    public getDeltaTimeSum(): number {
        return this.midi.getDeltaTimeSum(0);
    }



}