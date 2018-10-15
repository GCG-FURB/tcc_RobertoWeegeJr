
export class MidiSpectrum {

    //tamanho em x
    private _width: number; 
    //tamanho em y
    private _height: number;

    private _lines: MidiSpectrumLine[];
    
    constructor() {
        this.lines = [];
    }

    get width(): number {
        return this._width;
    }
    
    set width(width:number) {
        this._width = width;
    }
    
    get height(): number {
        return this._height;
    }
    
    set height(height:number) {
        this._height = height;
    }
    
    get lines(): MidiSpectrumLine[] {
        return this._lines;
    }
    
    set lines(lines:MidiSpectrumLine[]) {
        this._lines = lines;
    }

    public generateLinesY(){
        for (let line of this.lines) {
            line.y = this.lines.length - 1 - this.lines.indexOf(line) 
        }
    }


    public getSVG(): string {

        this.generateLinesY();

        let svg: string = `<svg width="${this.width / 50000.0}cm" height="${this.lines.length / 2.0}cm" version="1.1" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="0cm" y="0cm" width="${this.width / 50000.0}cm" height="${this.lines.length / 2.0}cm" fill="blue"/>`;
        for (let line of this.lines) {
            for (let note of line.notes) {
                svg += `<rect x="${note.x / 50000.0}cm" y="${line.y / 2.0}cm" width="${note.width / 50000.0}cm" height="${0.5}cm" fill="green"/>`;
            }
        }
        svg += `</svg>`; 

        return svg;

    }
    
}

export class MidiSpectrumLine {

    private _y: number;
    private _height: number; 

    private _noteValue: number;

    private _notes: MidiSpectrumNote[];

    constructor() {
        this.notes = [];
    }

    get y(): number {
        return this._y;
    }
    
    set y(y:number) {
        this._y = y;
    }
    
    get height(): number {
        return this._height;
    }
    
    set height(height:number) {
        this._height = height;
    }
    
    get noteValue(): number {
        return this._noteValue;
    }
    
    set noteValue(noteValue:number) {
        this._noteValue = noteValue;
    }
    
    get notes(): MidiSpectrumNote[] {
        return this._notes;
    }
    
    set notes(notes:MidiSpectrumNote[]) {
        this._notes = notes;
    }
}

export class MidiSpectrumNote {
    private _x: number;
    private _width: number; 
    
    get x(): number {
        return this._x;
    }
    
    set x(x:number) {
        this._x = x;
    }

    get width(): number {
        return this._width;
    }
    
    set width(width:number) {
        this._width = width;
    }
} 
