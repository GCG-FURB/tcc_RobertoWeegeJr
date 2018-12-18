import { Midi } from "./midi";

export class MidiSpectrum {

    private _minNote: number;
    private _maxNote: number;
    private _deltaTime: number;
    private _lines: MidiSpectrumLine[];
    
    constructor() {
        this.lines = [];
    }

    get minNote(): number {
        return this._minNote;
    }

    set minNote(minNote: number) {
        if (!minNote && minNote != 0) 
            throw new Error(`A nota não pode ser nula.`);
        
        if (minNote < Midi.MIN_NOTE_NUMBER) 
            throw new Error(`A nota não pode menor que ${Midi.MIN_NOTE_NUMBER}.`);
        
        if (minNote > Midi.MAX_NOTE_NUMBER)
            throw new Error(`A nota não pode maior que ${Midi.MAX_NOTE_NUMBER}.`);

        this._minNote = minNote;
    }
    
    get maxNote(): number {
        return this._maxNote;
    }
    
    set maxNote(maxNote: number) {
        if (!maxNote && maxNote != 0) 
            throw new Error(`A nota não pode ser nula.`);
        
        if (maxNote < Midi.MIN_NOTE_NUMBER) 
            throw new Error(`A nota não pode menor que ${Midi.MIN_NOTE_NUMBER}.`);
        
        if (maxNote > Midi.MAX_NOTE_NUMBER)
            throw new Error(`A nota não pode maior que ${Midi.MAX_NOTE_NUMBER}.`);

        this._maxNote = maxNote;
    }
    
    get deltaTime(): number {
        return this._deltaTime;
    }
    
    set deltaTime(deltaTime: number) {
        if (!deltaTime && deltaTime != 0) 
            throw new Error(`O delta time não pode ser nulo.`);
        
        if (deltaTime < Midi.MIN_DELTA_TIME_VALUE) 
            throw new Error(`O delta time não pode menor que ${Midi.MIN_DELTA_TIME_VALUE}.`);
        
        if (deltaTime > Midi.MAX_DELTA_TIME_VALUE)
            throw new Error(`O delta time não pode maior que ${Midi.MAX_DELTA_TIME_VALUE}.`);
        
        this._deltaTime = deltaTime;
    }     
    
    get lines(): MidiSpectrumLine[] {
        return this._lines;
    }
    
    set lines(lines:MidiSpectrumLine[]) {
        this._lines = lines;
    }

}

export class MidiSpectrumLine {

    private _noteValue: number;
    private _notes: MidiSpectrumNote[];

    constructor() {
        this.notes = [];
    }
    
    get noteValue(): number {
        return this._noteValue;
    }
    
    set noteValue(noteValue: number) {
        if (!noteValue && noteValue != 0) 
            throw new Error(`A nota não pode ser nula.`);
        
        if (noteValue < Midi.MIN_NOTE_NUMBER) 
            throw new Error(`A nota não pode menor que ${Midi.MIN_NOTE_NUMBER}.`);
        
        if (noteValue > Midi.MAX_NOTE_NUMBER)
            throw new Error(`A nota não pode maior que ${Midi.MAX_NOTE_NUMBER}.`);
        
        this._noteValue = noteValue;
    }
    
    get notes(): MidiSpectrumNote[] {
        return this._notes;
    }

    set notes(notes: MidiSpectrumNote[]) {
        this._notes = notes;
    }
}

export class MidiSpectrumNote {

    private _deltaTimeStart: number;
    private _deltaTimeEnd: number; 

    get deltaTimeStart(): number {
        return this._deltaTimeStart;
    }

    set deltaTimeStart(deltaTimeStart: number) {
        if (!deltaTimeStart && deltaTimeStart != 0) 
            throw new Error(`O delta time de início não pode ser nulo.`);
        
        if (deltaTimeStart < Midi.MIN_DELTA_TIME_VALUE) 
            throw new Error(`O delta time de início não pode menor que ${Midi.MIN_DELTA_TIME_VALUE}.`);
        
        if (deltaTimeStart > Midi.MAX_DELTA_TIME_VALUE)
            throw new Error(`O delta time de início não pode maior que ${Midi.MAX_DELTA_TIME_VALUE}.`);

        this._deltaTimeStart = deltaTimeStart;
    }

    get deltaTimeEnd(): number {
        return this._deltaTimeEnd;
    }

    set deltaTimeEnd(deltaTimeEnd: number) {
        if (!deltaTimeEnd && deltaTimeEnd != 0) 
            throw new Error(`O delta time de finalização não pode ser nulo.`);
        
        if (deltaTimeEnd < Midi.MIN_DELTA_TIME_VALUE) 
            throw new Error(`O delta time de finalização não pode menor que ${Midi.MIN_DELTA_TIME_VALUE}.`);
        
        if (deltaTimeEnd > Midi.MAX_DELTA_TIME_VALUE)
            throw new Error(`O delta time de finalização não pode maior que ${Midi.MAX_DELTA_TIME_VALUE}.`);

        this._deltaTimeEnd = deltaTimeEnd;
    }

} 

export class CompositionMidiSpectrumsData {

    private _spectrums: MidiSpectrum[][];
    private _musicalInstruments: number[][];
    private _minNotes: number[];
    private _maxNotes: number[];

    constructor(spectrums: MidiSpectrum[][], musicalInstruments: number[][], minNotes: number[], maxNotes: number[]) {
        this.spectrums = spectrums;
        this.musicalInstruments = musicalInstruments;
        this.minNotes = minNotes;
        this.maxNotes = maxNotes;
    }

    get spectrums(): MidiSpectrum[][] {
        return this._spectrums;
    }

    set spectrums(spectrums: MidiSpectrum[][]) {
        this._spectrums = spectrums;
    }
    
    get musicalInstruments(): number[][] {
        return this._musicalInstruments;
    }
    
    set musicalInstruments(musicalInstruments: number[][]) {
        this._musicalInstruments = musicalInstruments;
    }
    
    get minNotes(): number[] {
        return this._minNotes;
    }
    
    set minNotes(minNotes: number[]) {
        this._minNotes = minNotes;
    }
    
    get maxNotes(): number[] {
        return this._maxNotes;
    }
    
    set maxNotes(maxNotes: number[]) {
        this._maxNotes = maxNotes;
    }

}