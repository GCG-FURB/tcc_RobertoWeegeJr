
export class MidiSpectrum {

    deltaTime: number;

    minNote: number;
    maxNote: number;

    private _lines: MidiSpectrumLine[];
    
    constructor() {
        this.lines = [];
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
    deltaTimeStart: number;
    deltaTimeEnd: number; 
} 
